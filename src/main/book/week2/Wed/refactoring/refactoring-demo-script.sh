#!/bin/bash

# Refactoring Demo Script
# Author: Claude Code Assistant
# Version: 1.1
# Description: Automated refactoring script that outputs results to separate directories
#              for easy before/after comparison

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/refactoring-config.json"
LOG_FILE="${SCRIPT_DIR}/refactoring.log"
OUTPUT_DIR="${SCRIPT_DIR}/after"
INPUT_DIR="${SCRIPT_DIR}/before"
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
        warning "Claude Code CLI not found. Will simulate refactoring for demo purposes."
        CLAUDE_EXECUTABLE="echo"
        return 0
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
    }
  ],
  "settings": {
    "output_to_files": true,
    "create_backup": true,
    "simulate_mode": false,
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

# Create output directory structure
setup_output_directories() {
    log "Setting up output directories..."
    
    # Create main output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Create scenario directories for each strategy
    local strategies
    strategies=$(jq -r '.strategies[].name' "$CONFIG_FILE")
    
    while IFS= read -r strategy_name; do
        mkdir -p "$OUTPUT_DIR/$strategy_name"
        success "Created output directory: $OUTPUT_DIR/$strategy_name"
    done <<< "$strategies"
}

# Copy source files to output directory
copy_source_files() {
    local strategy_name="$1"
    local output_strategy_dir="$OUTPUT_DIR/$strategy_name"
    
    log "Copying source files to: $output_strategy_dir"
    
    if [[ -d "$INPUT_DIR" ]]; then
        cp -r "$INPUT_DIR"/* "$output_strategy_dir"/ 2>/dev/null || {
            warning "No files found in $INPUT_DIR to copy"
            return 1
        }
        success "Source files copied to $output_strategy_dir"
    else
        warning "Input directory $INPUT_DIR not found"
        return 1
    fi
}

# Simulate refactoring (for demo purposes when Claude CLI is not available)
simulate_refactoring() {
    local strategy_name="$1"
    local description="$2"
    local output_strategy_dir="$OUTPUT_DIR/$strategy_name"
    
    log "Simulating refactoring for: $strategy_name"
    
    # Create a demo refactored version based on strategy
    case "$strategy_name" in
        "extract-functions")
            simulate_extract_functions "$output_strategy_dir"
            ;;
        "remove-duplications")
            simulate_remove_duplications "$output_strategy_dir"
            ;;
        "improve-naming")
            simulate_improve_naming "$output_strategy_dir"
            ;;
        "simplify-conditionals")
            simulate_simplify_conditionals "$output_strategy_dir"
            ;;
        "optimize-imports")
            simulate_optimize_imports "$output_strategy_dir"
            ;;
        *)
            log "Generic simulation for strategy: $strategy_name"
            ;;
    esac
    
    # Create a summary file
    cat > "$output_strategy_dir/REFACTORING_SUMMARY.md" << EOF
# Refactoring Summary: $strategy_name

## Strategy Description
$description

## Changes Applied (Simulated)
- Applied $strategy_name refactoring strategy
- Files processed: $(find "$output_strategy_dir" -name "*.js" -o -name "*.py" -o -name "*.css" | wc -l)
- Refactoring completed at: $(date)

## Files Modified
$(find "$output_strategy_dir" -name "*.js" -o -name "*.py" -o -name "*.css" | sed "s|$output_strategy_dir/||")

EOF
    
    success "Simulation completed for: $strategy_name"
}

# Simulate function extraction
simulate_extract_functions() {
    local dir="$1"
    
    # Find JavaScript files and add comments showing extraction
    find "$dir" -name "*.js" -exec sed -i '' 's/\/\/ Long function that needs to be extracted into smaller functions/\/\/ REFACTORED: This function has been broken down into smaller, focused functions/g' {} \; 2>/dev/null || true
    
    # Add a comment to Python files
    find "$dir" -name "*.py" -exec sed -i '' 's/# Long function that needs extraction/# REFACTORED: Function extracted into smaller, focused methods/g' {} \; 2>/dev/null || true
}

# Simulate duplication removal
simulate_remove_duplications() {
    local dir="$1"
    
    # Add comments showing duplication removal
    find "$dir" -name "*.js" -exec sed -i '' 's/\/\/ Duplicated login logic/\/\/ REFACTORED: Duplicated logic extracted into reusable functions/g' {} \; 2>/dev/null || true
    find "$dir" -name "*.py" -exec sed -i '' 's/# Duplicated validation logic/# REFACTORED: Common validation logic extracted to shared module/g' {} \; 2>/dev/null || true
    find "$dir" -name "*.css" -exec sed -i '' 's/\/\* Duplicated styles \*\//\/\* REFACTORED: Common styles consolidated into reusable classes \*\//g' {} \; 2>/dev/null || true
}

# Simulate naming improvements
simulate_improve_naming() {
    local dir="$1"
    
    # Show naming improvements in comments
    find "$dir" -name "*.js" -exec sed -i '' 's/\/\/ Poor variable naming and complex logic/\/\/ REFACTORED: Variables renamed for clarity and readability/g' {} \; 2>/dev/null || true
    find "$dir" -name "*.py" -exec sed -i '' 's/# Poor naming and complex conditionals/# REFACTORED: Descriptive variable names and simplified logic/g' {} \; 2>/dev/null || true
    find "$dir" -name "*.css" -exec sed -i '' 's/\/\* Poor naming and overly specific selectors \*\//\/\* REFACTORED: Semantic class names and simplified selectors \*\//g' {} \; 2>/dev/null || true
}

# Simulate conditional simplification
simulate_simplify_conditionals() {
    local dir="$1"
    
    find "$dir" -name "*.js" -exec sed -i '' 's/\/\/ Complex conditional logic that needs simplification/\/\/ REFACTORED: Complex conditionals simplified with guard clauses and early returns/g' {} \; 2>/dev/null || true
    find "$dir" -name "*.py" -exec sed -i '' 's/# Poor naming and complex conditionals/# REFACTORED: Conditional logic simplified and made more readable/g' {} \; 2>/dev/null || true
}

# Simulate import optimization
simulate_optimize_imports() {
    local dir="$1"
    
    find "$dir" -name "*.js" -exec sed -i '' '1i\
// REFACTORED: Imports organized and unused imports removed\
' {} \; 2>/dev/null || true
    
    find "$dir" -name "*.py" -exec sed -i '' '1i\
# REFACTORED: Imports organized, grouped, and unused imports removed\
' {} \; 2>/dev/null || true
}

# Execute refactoring strategy
execute_refactoring_strategy() {
    local strategy="$1"
    local strategy_name
    local description
    local prompt
    
    strategy_name=$(echo "$strategy" | jq -r '.name')
    description=$(echo "$strategy" | jq -r '.description')
    prompt=$(echo "$strategy" | jq -r '.prompt')
    
    log "Executing refactoring strategy: $strategy_name"
    log "Description: $description"
    
    # Copy source files to strategy output directory
    if ! copy_source_files "$strategy_name"; then
        error "Failed to copy source files for strategy: $strategy_name"
        return 1
    fi
    
    local output_strategy_dir="$OUTPUT_DIR/$strategy_name"
    
    # Check if we should simulate or use real Claude
    local simulate_mode
    simulate_mode=$(jq -r '.settings.simulate_mode // false' "$CONFIG_FILE")
    
    if [[ "$simulate_mode" == "true" ]] || [[ "$CLAUDE_EXECUTABLE" == "echo" ]]; then
        simulate_refactoring "$strategy_name" "$description"
    else
        # Create a comprehensive prompt for Claude Code
        local full_prompt="REFACTORING TASK: $description

$prompt

Please analyze the code in the current directory and apply this refactoring strategy systematically. 

Guidelines:
1. Maintain existing functionality
2. Follow the project's coding conventions
3. Update tests if necessary
4. Ensure changes are atomic and focused
5. Add appropriate comments where needed

After making changes, please verify that:
- Code compiles/runs without errors
- Existing functionality is preserved
- Code quality is improved
- Changes follow best practices"

        log "Running Claude Code with prompt for: $strategy_name"
        
        # Change to the strategy output directory and run Claude
        (
            cd "$output_strategy_dir"
            
            if echo "$full_prompt" | "$CLAUDE_EXECUTABLE" --print 2>&1 | tee -a "$LOG_FILE"; then
                success "Claude Code execution completed for: $strategy_name"
            else
                error "Claude Code execution failed for: $strategy_name"
                return 1
            fi
        )
    fi
    
    success "Refactoring strategy completed: $strategy_name"
    return 0
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
    
    # List output directories
    echo -e "${CYAN}=== OUTPUT DIRECTORIES ===${NC}"
    if [[ -d "$OUTPUT_DIR" ]]; then
        ls -la "$OUTPUT_DIR"
    else
        echo "No output directories found"
    fi
}

# Show help
show_help() {
    cat << EOF
Refactoring Demo Script with Output to Directories

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help          Show this help message
    -c, --config FILE   Use custom configuration file
    -o, --output DIR    Set output directory (default: ./after)
    -i, --input DIR     Set input directory (default: ./before)
    -l, --list          List available refactoring strategies
    -s, --strategy NAME Run only specific strategy
    --init              Initialize default configuration
    --simulate          Run in simulation mode (for demo)
    --cleanup           Remove output directories

EXAMPLES:
    $0                          # Run all refactoring strategies
    $0 --strategy extract-functions  # Run only function extraction
    $0 --simulate               # Run in simulation mode
    $0 --output ./results       # Use custom output directory
    $0 --cleanup                # Remove output directories

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

# Cleanup output directories
cleanup_output() {
    log "Cleaning up output directories..."
    
    if [[ -d "$OUTPUT_DIR" ]]; then
        rm -rf "$OUTPUT_DIR"
        success "Output directory cleaned up: $OUTPUT_DIR"
    fi
    
    if [[ -f "$LOG_FILE" ]]; then
        rm -f "$LOG_FILE"
        success "Log file removed: $LOG_FILE"
    fi
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
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -i|--input)
                INPUT_DIR="$2"
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
            --simulate)
                SIMULATE_MODE=true
                shift
                ;;
            --cleanup)
                cleanup_output
                exit 0
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
    echo -e "${PURPLE}🔧 Claude Code Refactoring Demo Script${NC}"
    echo -e "${PURPLE}=====================================${NC}"
    echo ""
    
    # Initialize log file
    echo "Refactoring session started at $(date)" > "$LOG_FILE"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Enable simulation mode if requested
    if [[ "$SIMULATE_MODE" == "true" ]]; then
        jq '.settings.simulate_mode = true' "$CONFIG_FILE" > tmp.$$ && mv tmp.$$ "$CONFIG_FILE"
    fi
    
    # Check prerequisites
    check_claude_availability
    
    # Initialize configuration if needed
    init_config
    
    # Load configuration
    load_config
    
    # Setup output directories
    setup_output_directories
    
    log "Input directory: $INPUT_DIR"
    log "Output directory: $OUTPUT_DIR"
    
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
    
    success "Refactoring demo script completed!"
    log "Check output directories in: $OUTPUT_DIR"
    log "Check $LOG_FILE for detailed logs"
    
    echo ""
    echo -e "${CYAN}=== NEXT STEPS ===${NC}"
    echo "1. Compare files in 'before/' vs 'after/' directories"
    echo "2. Review refactoring summaries in each strategy directory"
    echo "3. Examine the detailed logs in: $LOG_FILE"
}

# Run main function with all arguments
main "$@"