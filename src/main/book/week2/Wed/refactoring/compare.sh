#!/bin/bash

# Simple comparison script to show before/after differences
# Usage: ./compare.sh [strategy_name] [file_name]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BEFORE_DIR="$SCRIPT_DIR/before"
AFTER_DIR="$SCRIPT_DIR/after"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    cat << EOF
Refactoring Comparison Tool

USAGE:
    $0 [strategy] [file]

ARGUMENTS:
    strategy    Refactoring strategy (extract-functions, remove-duplications, improve-naming, simplify-conditionals, optimize-imports)
    file        File name to compare (user-service.js, data_processor.py, styles.css)

EXAMPLES:
    $0                                      # Show all available comparisons
    $0 extract-functions                    # Show all files for extract-functions strategy
    $0 extract-functions user-service.js    # Compare specific file

EOF
}

list_strategies() {
    echo -e "${BLUE}Available Strategies:${NC}"
    if [[ -d "$AFTER_DIR" ]]; then
        ls -1 "$AFTER_DIR" | while read strategy; do
            echo "  - $strategy"
        done
    else
        echo "  No strategies found. Run the refactoring demo script first."
    fi
}

list_files() {
    echo -e "${BLUE}Available Files:${NC}"
    if [[ -d "$BEFORE_DIR" ]]; then
        ls -1 "$BEFORE_DIR" | while read file; do
            echo "  - $file"
        done
    else
        echo "  No files found in before directory."
    fi
}

show_summary() {
    local strategy="$1"
    local summary_file="$AFTER_DIR/$strategy/REFACTORING_SUMMARY.md"
    
    if [[ -f "$summary_file" ]]; then
        echo -e "${YELLOW}=== Refactoring Summary: $strategy ===${NC}"
        cat "$summary_file"
        echo ""
    fi
}

compare_files() {
    local strategy="$1"
    local filename="$2"
    local before_file="$BEFORE_DIR/$filename"
    local after_file="$AFTER_DIR/$strategy/$filename"
    
    if [[ ! -f "$before_file" ]]; then
        echo -e "${RED}Error: Before file not found: $before_file${NC}"
        return 1
    fi
    
    if [[ ! -f "$after_file" ]]; then
        echo -e "${RED}Error: After file not found: $after_file${NC}"
        return 1
    fi
    
    echo -e "${BLUE}=== Comparing: $filename (Strategy: $strategy) ===${NC}"
    echo ""
    
    # Show lines with REFACTORED markers
    echo -e "${GREEN}Changes Applied:${NC}"
    grep -n "REFACTORED" "$after_file" 2>/dev/null || echo "  No explicit refactoring markers found"
    echo ""
    
    # Show file stats
    local before_lines=$(wc -l < "$before_file")
    local after_lines=$(wc -l < "$after_file")
    echo -e "${YELLOW}File Statistics:${NC}"
    echo "  Before: $before_lines lines"
    echo "  After:  $after_lines lines"
    echo "  Change: $((after_lines - before_lines)) lines"
    echo ""
    
    # Show side-by-side diff (if diff command available)
    if command -v diff >/dev/null 2>&1; then
        echo -e "${YELLOW}Differences:${NC}"
        diff -u "$before_file" "$after_file" | head -20
        if [[ ${PIPESTATUS[0]} -eq 0 ]]; then
            echo "  No differences found (simulation mode adds minimal changes)"
        fi
    fi
    
    echo ""
}

main() {
    if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        show_help
        exit 0
    fi
    
    if [[ $# -eq 0 ]]; then
        echo -e "${BLUE}Refactoring Demo Comparison Tool${NC}"
        echo ""
        list_strategies
        echo ""
        list_files
        echo ""
        echo "Use '$0 --help' for usage information"
        exit 0
    fi
    
    local strategy="$1"
    local filename="$2"
    
    if [[ ! -d "$AFTER_DIR/$strategy" ]]; then
        echo -e "${RED}Error: Strategy '$strategy' not found.${NC}"
        echo ""
        list_strategies
        exit 1
    fi
    
    # Show strategy summary
    show_summary "$strategy"
    
    if [[ -n "$filename" ]]; then
        # Compare specific file
        compare_files "$strategy" "$filename"
    else
        # Compare all files for the strategy
        if [[ -d "$BEFORE_DIR" ]]; then
            for file in "$BEFORE_DIR"/*; do
                if [[ -f "$file" ]]; then
                    filename=$(basename "$file")
                    compare_files "$strategy" "$filename"
                fi
            done
        fi
    fi
}

main "$@"