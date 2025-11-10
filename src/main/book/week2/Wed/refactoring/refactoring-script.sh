#!/bin/bash

# Refactoring Script with Claude Code Print Mode Integration
# Author: Claude Code Assistant
# Version: 1.0
# Description: Automated refactoring script that creates branches for each refactoring strategy
#              and uses Claude Code's print mode for systematic code improvements

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/refactoring-config.json"
LOG_FILE="${SCRIPT_DIR}/refactoring.log"
ORIGINAL_BRANCH=""
PROJECT_ROOT=""
CLAUDE_EXECUTABLE="claude"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if claude command is available
check_claude_availability() {
    if ! command -v "$CLAUDE_EXECUTABLE" &> /dev/null; then
        error "Claude Code CLI not found. Please install claude-code CLI first."
        echo "Installation: npm install -g @anthropic/claude-code"
        exit 1
    fi
    success "Claude Code CLI found"
}

# Initialize configuration file if it doesn't exist
init_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        cat > "$CONFIG_FILE" << 'EOF'
{
  "strategies": [
    {
      "name": "extract-functions",
      "description": "Extract long methods into smaller, focused functions",
      "priority": 1,
      "files": ["**/*.js", "**/*.ts", "**/*.py", "**/*.java", "**/*.go"],
      "prompt": "Analyze the code and extract overly long functions into smaller, focused functions. Focus on functions with more than 20 lines or multiple responsibilities."
    },
    {
      "name": "remove-duplications",
      "description": "Identify and eliminate code duplications",
      "priority": 2,
      "files": ["**/*"],
      "prompt": "Identify duplicated code patterns and create reusable functions or modules. Look for similar code blocks, repeated logic, and common patterns that can be abstracted."
    },
    {
      "name": "improve-naming",
      "description": "Improve variable, function, and class naming conventions",
      "priority": 3,
      "files": ["**/*"],
      "prompt": "Review and improve naming conventions. Make variable names, function names, and class names more descriptive and follow language conventions. Rename ambiguous or abbreviated names."
    },
    {
      "name": "simplify-conditionals",
      "description": "Simplify complex conditional logic",
      "priority": 4,
      "files": ["**/*"],
      "prompt": "Simplify complex conditional statements. Use guard clauses, extract complex conditions into well-named boolean variables, and reduce nesting levels."
    },
    {
      "name": "optimize-imports",
      "description": "Organize and optimize import statements",
      "priority": 5,
      "files": ["**/*.js", "**/*.ts", "**/*.py", "**/*.java"],
      "prompt": "Organize import statements. Remove unused imports, group related imports together, and follow language-specific import conventions."
    },
    {
      "name": "add-error-handling",
      "description": "Add proper error handling and validation",
      "priority": 6,
      "files": ["**/*"],
      "prompt": "Add comprehensive error handling. Include proper try-catch blocks, input validation, and meaningful error messages. Handle edge cases and potential failures."
    },
    {
      "name": "improve-performance",
      "description": "Optimize performance bottlenecks",
      "priority": 7,
      "files": ["**/*"],
      "prompt": "Identify and optimize performance bottlenecks. Look for inefficient loops, unnecessary computations, memory leaks, and opportunities for caching or memoization."
    },
    {
      "name": "enhance-readability",
      "description": "Improve overall code readability and documentation",
      "priority": 8,
      "files": ["**/*"],
      "prompt": "Enhance code readability. Add meaningful comments, improve code structure, use consistent formatting, and ensure the code tells a clear story."
    }
  ],
  "settings": {
    "create_backup": true,
    "run_tests": true,
    "commit_changes": true,
    "push_branches": false,
    "cleanup_branches": false,
    "max_concurrent": 1
  }
}
EOF
        success "Created default configuration file: $CONFIG_FILE"
        log "You can customize the refactoring strategies in $CONFIG_FILE"
    fi
}

# Load configuration
load_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi
    
    # Validate JSON
    if ! jq empty "$CONFIG_FILE" 2>/dev/null; then
        error "Invalid JSON in configuration file: $CONFIG_FILE"
        exit 1
    fi
    
    success "Configuration loaded from $CONFIG_FILE"
}

# Get git repository root
get_project_root() {
    PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
    if [[ -z "$PROJECT_ROOT" ]]; then
        error "Not in a git repository. Please run this script from within a git repository."
        exit 1
    fi
    success "Project root: $PROJECT_ROOT"
}

# Save current branch
save_current_branch() {
    ORIGINAL_BRANCH=$(git branch --show-current)
    if [[ -z "$ORIGINAL_BRANCH" ]]; then
        error "Could not determine current branch"
        exit 1
    fi
    success "Current branch saved: $ORIGINAL_BRANCH"
}

# Create and switch to a new branch
create_refactoring_branch() {
    local strategy_name="$1"
    local branch_name="refactor/${strategy_name}-$(date +%Y%m%d-%H%M%S)"
    
    log "Creating branch: $branch_name"
    
    # Ensure we're on the original branch
    git checkout "$ORIGINAL_BRANCH" 2>/dev/null || {
        error "Failed to checkout original branch: $ORIGINAL_BRANCH"
        return 1
    }
    
    # Create and switch to new branch
    git checkout -b "$branch_name" || {
        error "Failed to create branch: $branch_name"
        return 1
    }
    
    success "Created and switched to branch: $branch_name"
    echo "$branch_name"
}

# Run tests if configured
run_tests() {
    local test_config
    test_config=$(jq -r '.settings.run_tests' "$CONFIG_FILE")
    
    if [[ "$test_config" == "true" ]]; then
        log "Running tests..."
        
        # Try different test commands based on project type
        if [[ -f "package.json" ]]; then
            if npm run test 2>/dev/null; then
                success "Tests passed"
                return 0
            fi
        elif [[ -f "Makefile" ]] && grep -q "test" Makefile; then
            if make test 2>/dev/null; then
                success "Tests passed"
                return 0
            fi
        elif [[ -f "pytest.ini" ]] || [[ -f "setup.py" ]]; then
            if python -m pytest 2>/dev/null; then
                success "Tests passed"
                return 0
            fi
        fi
        
        warning "Could not run tests or tests failed"
        return 1
    fi
    
    return 0
}

# Execute refactoring strategy using Claude Code
execute_refactoring_strategy() {
    local strategy="$1"
    local strategy_name
    local description
    local prompt
    local files_pattern
    
    strategy_name=$(echo "$strategy" | jq -r '.name')
    description=$(echo "$strategy" | jq -r '.description')
    prompt=$(echo "$strategy" | jq -r '.prompt')
    files_pattern=$(echo "$strategy" | jq -r '.files[]' | tr '\n' ' ')
    
    log "Executing refactoring strategy: $strategy_name"
    log "Description: $description"
    
    # Create branch for this strategy
    local branch_name
    branch_name=$(create_refactoring_branch "$strategy_name")
    if [[ -z "$branch_name" ]]; then
        error "Failed to create branch for strategy: $strategy_name"
        return 1
    fi
    
    # Create a comprehensive prompt for Claude Code
    local full_prompt="REFACTORING TASK: $description

$prompt

Please analyze the current codebase and apply this refactoring strategy systematically. 

Guidelines:
1. Maintain existing functionality
2. Follow the project's coding conventions
3. Update tests if necessary
4. Ensure changes are atomic and focused
5. Add appropriate comments where needed

Focus on files matching patterns: $files_pattern

After making changes, please verify that:
- Code compiles/runs without errors
- Existing functionality is preserved
- Code quality is improved
- Changes follow best practices"

    log "Running Claude Code with prompt for: $strategy_name"
    
    # Execute Claude Code in print mode
    if echo "$full_prompt" | "$CLAUDE_EXECUTABLE" --print 2>&1 | tee -a "$LOG_FILE"; then
        success "Claude Code execution completed for: $strategy_name"
        
        # Check if there are any changes
        if git diff --quiet; then
            warning "No changes made for strategy: $strategy_name"
            git checkout "$ORIGINAL_BRANCH"
            git branch -D "$branch_name" 2>/dev/null || true
            return 0
        fi
        
        # Run tests
        if ! run_tests; then
            error "Tests failed for strategy: $strategy_name"
            git checkout "$ORIGINAL_BRANCH"
            git branch -D "$branch_name" 2>/dev/null || true
            return 1
        fi
        
        # Commit changes if configured
        local commit_config
        commit_config=$(jq -r '.settings.commit_changes' "$CONFIG_FILE")
        if [[ "$commit_config" == "true" ]]; then
            git add -A
            git commit -m "refactor: $description

Applied refactoring strategy: $strategy_name
- $description

Generated by: Claude Code Refactoring Script
Branch: $branch_name" || {
                error "Failed to commit changes for strategy: $strategy_name"
                return 1
            }
            success "Changes committed for strategy: $strategy_name"
        fi
        
        # Push branch if configured
        local push_config
        push_config=$(jq -r '.settings.push_branches' "$CONFIG_FILE")
        if [[ "$push_config" == "true" ]]; then
            git push -u origin "$branch_name" || {
                warning "Failed to push branch: $branch_name"
            }
        fi
        
        success "Refactoring strategy completed: $strategy_name"
        
    else
        error "Claude Code execution failed for: $strategy_name"
        git checkout "$ORIGINAL_BRANCH"
        git branch -D "$branch_name" 2>/dev/null || true
        return 1
    fi
}

# Main refactoring process
main_refactoring_process() {
    local strategies
    strategies=$(jq -c '.strategies | sort_by(.priority)[]' "$CONFIG_FILE")
    
    log "Starting refactoring process with $(echo "$strategies" | wc -l) strategies"
    
    local success_count=0
    local total_count=0
    
    while IFS= read -r strategy; do
        ((total_count++))
        
        log "Processing strategy $total_count..."
        
        if execute_refactoring_strategy "$strategy"; then
            ((success_count++))
        fi
        
        # Switch back to original branch
        git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
        
        echo ""
        
    done <<< "$strategies"
    
    success "Refactoring process completed: $success_count/$total_count strategies successful"
    
    # Show summary
    echo ""
    echo -e "${CYAN}=== REFACTORING SUMMARY ===${NC}"
    echo "Total strategies: $total_count"
    echo "Successful: $success_count"
    echo "Failed: $((total_count - success_count))"
    echo ""
    
    # List created branches
    echo -e "${CYAN}=== CREATED BRANCHES ===${NC}"
    git branch | grep "refactor/" || echo "No refactoring branches found"
}

# Cleanup function
cleanup_branches() {
    local cleanup_config
    cleanup_config=$(jq -r '.settings.cleanup_branches' "$CONFIG_FILE")
    
    if [[ "$cleanup_config" == "true" ]]; then
        log "Cleaning up refactoring branches..."
        git branch | grep "refactor/" | xargs -r git branch -D
        success "Refactoring branches cleaned up"
    fi
}

# Show help
show_help() {
    cat << EOF
Refactoring Script with Claude Code Integration

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help          Show this help message
    -c, --config FILE   Use custom configuration file
    -l, --list          List available refactoring strategies
    -s, --strategy NAME Run only specific strategy
    --init              Initialize default configuration
    --cleanup           Cleanup refactoring branches
    --dry-run           Show what would be done without executing

EXAMPLES:
    $0                          # Run all refactoring strategies
    $0 --strategy extract-functions  # Run only function extraction
    $0 --config custom.json     # Use custom configuration
    $0 --list                   # List available strategies
    $0 --cleanup                # Remove refactoring branches

CONFIGURATION:
    Edit $CONFIG_FILE to customize strategies and settings.

EOF
}

# List strategies
list_strategies() {
    echo -e "${CYAN}Available Refactoring Strategies:${NC}"
    echo ""
    
    jq -r '.strategies[] | "[\(.priority)] \(.name): \(.description)"' "$CONFIG_FILE" | sort -n
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--config)
                CONFIG_FILE="$2"
                shift 2
                ;;
            -l|--list)
                load_config
                list_strategies
                exit 0
                ;;
            -s|--strategy)
                SINGLE_STRATEGY="$2"
                shift 2
                ;;
            --init)
                init_config
                exit 0
                ;;
            --cleanup)
                cleanup_branches
                exit 0
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            *)
                error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Main function
main() {
    echo -e "${PURPLE}🔧 Claude Code Refactoring Script${NC}"
    echo -e "${PURPLE}===================================${NC}"
    echo ""
    
    # Initialize log file
    echo "Refactoring session started at $(date)" > "$LOG_FILE"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Check prerequisites
    check_claude_availability
    
    # Initialize configuration if needed
    init_config
    
    # Load configuration
    load_config
    
    # Get project information
    get_project_root
    save_current_branch
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    if [[ -n "$SINGLE_STRATEGY" ]]; then
        log "Running single strategy: $SINGLE_STRATEGY"
        strategy=$(jq --arg name "$SINGLE_STRATEGY" '.strategies[] | select(.name == $name)' "$CONFIG_FILE")
        if [[ -z "$strategy" ]]; then
            error "Strategy not found: $SINGLE_STRATEGY"
            exit 1
        fi
        execute_refactoring_strategy "$strategy"
    else
        # Run main refactoring process
        main_refactoring_process
    fi
    
    # Return to original branch
    git checkout "$ORIGINAL_BRANCH" 2>/dev/null || true
    
    success "Refactoring script completed!"
    log "Check $LOG_FILE for detailed logs"
}

# Run main function with all arguments
main "$@"