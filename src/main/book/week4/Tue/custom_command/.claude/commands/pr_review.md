---
name: pr-review
argument-hint: [pr-repo] [pr-number]
description: Perform a comprehensive PR review with code analysis, best practices check, and suggestions
allowed-tools:
  - mcp__github__get_pull_request
  - mcp__github__get_pull_request_files
  - mcp__github__get_pull_request_diff
  - mcp__github__get_pull_request_reviews
  - mcp__github__get_pull_request_status
  - mcp__github__add_pull_request_review_comment_to_pending_review
  - mcp__github__create_pending_pull_request_review
  - mcp__github__submit_pending_pull_request_review
  - mcp__github__create_and_submit_pull_request_review
  - Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(gh pr:*)
  - Read
  - Write
  - Glob
  - Grep
---

About the PR $ARGUMENTS in github.com,
Please perform a comprehensive pull request review following these steps:

1. **Context Setup**
   - Use `git status` and `git branch` to understand current repository state
   - Use `git remote -v` to identify the repository and remote URLs
   - Extract owner/repo information for GitHub MCP tools

2. **Fetch PR Information**
   - Use GitHub MCP tools (`mcp__github__get_pull_request`) to get PR details
   - Get PR files changed with `mcp__github__get_pull_request_files`
   - Retrieve PR diff using `mcp__github__get_pull_request_diff`
   - Check existing reviews with `mcp__github__get_pull_request_reviews`
   - Alternative: Use `git fetch` and `git diff origin/main...feature-branch` if needed

3. **Code Analysis**
   - Read changed files using file reading tools
   - Check code quality and style consistency
   - Identify potential bugs or issues
   - Review error handling and edge cases
   - Evaluate performance implications
   - Check for security vulnerabilities
   - Run linting commands if available (`npm run lint`, etc.)

4. **Best Practices Review**
   - Verify adherence to project conventions
   - Check naming conventions and code patterns
   - Review code organization and structure
   - Evaluate test coverage if tests are included
   - Check documentation and comments
   - Verify commit messages follow conventions

5. **Architecture & Design**
   - Assess if changes align with existing architecture
   - Review dependency management
   - Check for code duplication
   - Evaluate maintainability and scalability
   - Consider backward compatibility

6. **Git History Analysis**
   - Use `git log --oneline -n 10` to check recent commits
   - Review commit structure and messages
   - Check for clean, logical commit organization

7. **Provide Feedback**
   - List critical issues that must be fixed
   - Suggest improvements and optimizations
   - Highlight good practices used
   - Provide specific, actionable feedback with code examples
   - Use `mcp__github__add_pull_request_review_comment_to_pending_review` for inline comments if requested

8. **Summary & Actions**
   - Overall assessment (Approve/Request Changes/Comment)
   - Key points for the author to address
   - Positive aspects of the implementation
   - Optionally create/submit review using GitHub MCP tools if requested

**Available Tools:**
- GitHub MCP: `get_pull_request`, `get_pull_request_files`, `get_pull_request_diff`, `get_pull_request_reviews`
- Git commands: `git status`, `git diff`, `git log`, `git show`, `git fetch`
- File operations: Read files, analyze code structure
- Linting: Run project-specific lint/test commands
