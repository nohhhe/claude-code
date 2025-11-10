# Claude Code를 활용한 리팩토링 데모

이 디렉토리는 Claude Code CLI와 통합된 커스텀 스크립트를 사용한 포괄적인 리팩토링 데모를 포함합니다. 실제 코드 예제에 다양한 리팩토링 전략을 적용한 결과를 보여줍니다.

## 디렉토리 구조

```
refactoring/
├── before/                    # 리팩토링 기회가 있는 원본 코드
│   ├── user-service.js       # 여러 문제가 있는 JavaScript 서비스
│   ├── data_processor.py     # 다양한 문제가 있는 Python 데이터 처리기
│   └── styles.css            # 조직화가 부족하고 중복이 있는 CSS
├── after/                     # 전략별로 정리된 리팩토링된 코드
│   ├── extract-functions/     # 함수 추출 결과
│   ├── remove-duplications/   # 중복 제거 결과
│   ├── improve-naming/        # 명명 개선 결과
│   ├── simplify-conditionals/ # 조건문 단순화 결과
│   └── optimize-imports/      # 임포트 최적화 결과
├── refactoring-script.sh      # 원본 리팩토링 스크립트 (git 기반)
├── refactoring-demo-script.sh # 데모 스크립트 (디렉토리 출력)
├── refactoring-config.json    # 리팩토링 전략 설정
└── refactoring.log           # 상세 실행 로그
```

## 코드 예제 개요

### JavaScript Example (`user-service.js`)

**Problems Demonstrated:**
- **Long Functions**: `createUser()` method is over 80 lines with multiple responsibilities
- **Code Duplication**: Authentication logic repeated in `authenticateUser()` and `adminLogin()`
- **Poor Naming**: Variables like `u`, `t`, `opts` instead of descriptive names
- **Complex Conditionals**: Nested permission checking logic
- **Missing Error Handling**: `bulkCreateUsers()` lacks proper error handling
- **Performance Issues**: Inefficient user counting and cleanup operations
- **Poor Readability**: Missing comments and complex nested logic

### Python Example (`data_processor.py`)

**Problems Demonstrated:**
- **Long Methods**: `process_user_data()` handles multiple formats and transformations
- **Duplicated Validation**: Similar validation logic in `validate_user_input()` and `validate_admin_input()`
- **Poor Naming**: Method `proc_data_by_type()` with unclear parameters `d`, `t`, `opts`
- **Complex Conditionals**: Nested if-else chains for access level determination
- **Missing Error Handling**: No exception handling in data fetching
- **Unorganized Imports**: Unused imports and poor import organization
- **Performance Issues**: Inefficient data processing patterns

### CSS Example (`styles.css`)

**Problems Demonstrated:**
- **Duplicated Styles**: Repeated navigation styles with minor differences
- **Poor Naming**: Generic class names like `.div1`, `.div2`, `.div3`
- **Overly Specific Selectors**: Deep nested selectors that are hard to maintain
- **Inconsistent Units**: Mix of `px`, `rem`, and `pt` units
- **Magic Numbers**: Unexplained spacing values like `23px`, `37px`
- **Missing Organization**: Scattered styles without logical grouping
- **Unused Styles**: Deprecated classes that are no longer used

## Refactoring Strategies

### 1. Extract Functions (Priority 1)
**Target**: Functions with more than 20 lines or multiple responsibilities
**Applied to**: `createUser()`, `process_user_data()`
**Benefits**: Improved readability, testability, and maintainability

### 2. Remove Duplications (Priority 2)
**Target**: Repeated code patterns and logic
**Applied to**: Authentication logic, validation functions, CSS styles
**Benefits**: DRY principle, easier maintenance, reduced bugs

### 3. Improve Naming (Priority 3)
**Target**: Ambiguous variable, function, and class names
**Applied to**: Method parameters, CSS classes, variable names
**Benefits**: Self-documenting code, improved readability

### 4. Simplify Conditionals (Priority 4)
**Target**: Complex nested conditionals and logic
**Applied to**: Permission checking, access level determination
**Benefits**: Reduced cognitive load, easier debugging

### 5. Optimize Imports (Priority 5)
**Target**: Unused imports and poor organization
**Applied to**: JavaScript and Python import statements
**Benefits**: Cleaner code, faster compilation, better organization

## Usage Instructions

### Running the Demo Script

```bash
# Initialize configuration
./refactoring-demo-script.sh --init

# Run all strategies in simulation mode
./refactoring-demo-script.sh --simulate

# Run a specific strategy
./refactoring-demo-script.sh --strategy extract-functions --simulate

# List available strategies
./refactoring-demo-script.sh --list

# Show help
./refactoring-demo-script.sh --help

# Cleanup generated files
./refactoring-demo-script.sh --cleanup
```

### Using with Real Claude Code CLI

If you have Claude Code CLI installed:

```bash
# Run without simulation mode (uses real Claude Code)
./refactoring-demo-script.sh

# Run specific strategy with real Claude Code
./refactoring-demo-script.sh --strategy improve-naming
```

## Configuration

The `refactoring-config.json` file controls the refactoring process:

```json
{
  "strategies": [
    {
      "name": "extract-functions",
      "description": "Extract long methods into smaller, focused functions",
      "priority": 1,
      "files": ["**/*.js", "**/*.ts", "**/*.py", "**/*.java", "**/*.go"],
      "prompt": "Analyze the code and extract overly long functions..."
    }
  ],
  "settings": {
    "output_to_files": true,
    "create_backup": true,
    "simulate_mode": false,
    "max_concurrent": 1
  }
}
```

## Comparing Results

### Before vs After Structure

Each refactoring strategy creates its own output directory containing:
- **Source Files**: Refactored versions of the original files
- **REFACTORING_SUMMARY.md**: Summary of changes applied
- **Added Comments**: Markers showing where refactoring was applied

### Example Comparison

**Before** (`before/user-service.js`):
```javascript
// Long function that needs to be extracted into smaller functions
async createUser(userData) {
    // 80+ lines of mixed responsibilities
    // Validation, user creation, email sending, database operations
}
```

**After** (`after/extract-functions/user-service.js`):
```javascript
// REFACTORED: This function has been broken down into smaller, focused functions
async createUser(userData) {
    // Same function but with refactoring markers
}
```

## Key Features

### 1. **Realistic Examples**
- Real-world code problems commonly found in production
- Multiple programming languages (JavaScript, Python, CSS)
- Various types of refactoring opportunities

### 2. **Systematic Approach**
- Priority-based refactoring strategy execution
- Configurable refactoring rules and prompts
- Organized output for easy comparison

### 3. **Educational Value**
- Clear before/after comparisons
- Detailed summaries of applied changes
- Demonstration of refactoring best practices

### 4. **Flexible Execution**
- Simulation mode for demonstration
- Real Claude Code integration
- Individual strategy execution

## Benefits Demonstrated

### Code Quality Improvements
- **Readability**: Better naming, structure, and organization
- **Maintainability**: Smaller functions, reduced duplication
- **Performance**: Optimized patterns and efficient operations
- **Reliability**: Better error handling and edge case management

### Development Process Benefits
- **Systematic Refactoring**: Structured approach to code improvement
- **Documentation**: Clear tracking of changes and rationale
- **Automation**: Reduced manual effort in identifying issues
- **Consistency**: Standardized refactoring patterns

## Learning Outcomes

After exploring this demo, you should understand:

1. **Common Code Smells**: How to identify problematic patterns
2. **Refactoring Strategies**: When and how to apply different techniques
3. **Systematic Approach**: How to organize refactoring efforts
4. **Tool Integration**: Using Claude Code for automated assistance
5. **Quality Measurement**: How to evaluate refactoring success

## Next Steps

To extend this demo:

1. **Add More Languages**: Include Java, Go, or other languages
2. **Advanced Strategies**: Add performance profiling, security improvements
3. **Real Integration**: Test with actual Claude Code CLI
4. **Metrics**: Add code quality metrics before/after comparison
5. **CI/CD Integration**: Incorporate into automated pipelines

## Notes

- The simulation mode provides educational markers showing where refactoring would occur
- Real Claude Code integration would provide actual refactored code
- Each strategy can be run independently or as part of a complete refactoring suite
- The configuration file allows customization of strategies and prompts

This demo provides a practical foundation for understanding systematic code refactoring using AI-assisted tools like Claude Code.