const _ = require('lodash');
const moment = require('moment'); // DEPRECATED: Should use dayjs or date-fns
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// FIXME: This entire file is a mess and should be refactored
// TODO: Split into logical modules
// TODO: Add proper error handling
// TODO: Add JSDoc documentation
// DEPRECATED: Many functions use old Node.js APIs

class LegacyUtils {
    constructor() {
        // FIXME: Hardcoded values
        this.DEFAULT_ENCODING = 'utf8';
        this.TEMP_DIR = '/tmp';
        this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        
        // TODO: Make this configurable
        this.config = {
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            timezone: 'UTC'
        };
    }

    // CYCLOMATIC COMPLEXITY: 18 (Too high!)
    // DEPRECATED: Using synchronous file operations
    // TODO: Make this async
    // FIXME: No error handling
    processDataFile(filePath, options) {
        let result = {
            success: false,
            data: null,
            errors: [],
            warnings: []
        };

        try {
            // FIXME: Synchronous file check
            if (!fs.existsSync(filePath)) {
                result.errors.push('File does not exist');
                return result;
            }

            // FIXME: Synchronous file stat
            const stats = fs.statSync(filePath);
            if (stats.size > this.MAX_FILE_SIZE) {
                result.errors.push('File too large');
                return result;
            }

            // DEPRECATED: Synchronous file read
            const fileContent = fs.readFileSync(filePath, this.DEFAULT_ENCODING);
            
            if (!fileContent || fileContent.trim().length === 0) {
                result.warnings.push('File is empty');
                result.success = true;
                result.data = [];
                return result;
            }

            const lines = fileContent.split('\n');
            const processedData = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line.length === 0) {
                    continue;
                }

                if (line.startsWith('#') || line.startsWith('//')) {
                    continue; // Skip comments
                }

                try {
                    let processedLine;
                    
                    if (options && options.format === 'json') {
                        processedLine = JSON.parse(line);
                    } else if (options && options.format === 'csv') {
                        processedLine = this.parseCSVLine(line);
                    } else if (options && options.format === 'tsv') {
                        processedLine = line.split('\t');
                    } else {
                        processedLine = line;
                    }

                    if (options && options.validator) {
                        const isValid = options.validator(processedLine);
                        if (!isValid) {
                            result.warnings.push(`Invalid data at line ${i + 1}`);
                            continue;
                        }
                    }

                    if (options && options.transformer) {
                        processedLine = options.transformer(processedLine);
                    }

                    if (options && options.filter) {
                        const shouldInclude = options.filter(processedLine);
                        if (!shouldInclude) {
                            continue;
                        }
                    }

                    processedData.push(processedLine);

                } catch (parseError) {
                    result.errors.push(`Parse error at line ${i + 1}: ${parseError.message}`);
                    if (options && options.strictMode) {
                        return result;
                    }
                }
            }

            result.success = true;
            result.data = processedData;

        } catch (error) {
            result.errors.push(error.message);
        }

        return result;
    }

    // FIXME: Naive CSV parsing, should use proper library
    // TODO: Handle edge cases like escaped quotes
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    // DEPRECATED: Using moment.js instead of modern date libraries
    // TODO: Replace with dayjs
    formatDate(date, format) {
        if (!date) {
            return null;
        }
        
        const momentDate = moment(date);
        if (!momentDate.isValid()) {
            return null;
        }
        
        return momentDate.format(format || this.config.dateFormat);
    }

    // DEPRECATED: Using moment.js
    // TODO: Add timezone handling
    getRelativeTime(date) {
        return moment(date).fromNow();
    }

    // DEPRECATED: Using moment.js
    // FIXME: No validation
    dateRange(startDate, endDate, step) {
        const start = moment(startDate);
        const end = moment(endDate);
        const dates = [];
        
        while (start.isSameOrBefore(end)) {
            dates.push(start.clone().toDate());
            start.add(1, step || 'day');
        }
        
        return dates;
    }

    // CYCLOMATIC COMPLEXITY: 16 (Too high!)
    // TODO: Break into smaller functions
    // FIXME: No input validation
    generateHash(data, algorithm, encoding) {
        try {
            if (!data) {
                return null;
            }

            const hashAlgorithm = algorithm || 'sha256';
            const hashEncoding = encoding || 'hex';

            let input;
            if (typeof data === 'string') {
                input = data;
            } else if (typeof data === 'object') {
                try {
                    input = JSON.stringify(data);
                } catch (jsonError) {
                    input = data.toString();
                }
            } else if (Buffer.isBuffer(data)) {
                input = data;
            } else {
                input = data.toString();
            }

            const hash = crypto.createHash(hashAlgorithm);
            hash.update(input);
            
            const result = hash.digest(hashEncoding);
            
            if (hashEncoding === 'hex' && result.length < 32) {
                // FIXME: This padding logic is wrong
                return result.padStart(32, '0');
            }
            
            return result;

        } catch (error) {
            console.error('Hash generation error:', error);
            return null;
        }
    }

    // DEPRECATED: Using crypto.randomBytes synchronously
    // TODO: Use async version
    generateRandomString(length, charset) {
        const len = length || 16;
        const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        // FIXME: Potential security issue with weak randomness
        const bytes = crypto.randomBytes(len);
        let result = '';
        
        for (let i = 0; i < len; i++) {
            result += chars[bytes[i] % chars.length];
        }
        
        return result;
    }

    // DEPRECATED: Synchronous file operations
    // TODO: Use async/await
    // FIXME: No proper error handling
    writeToTempFile(data, extension) {
        try {
            const fileName = `temp_${Date.now()}_${this.generateRandomString(8)}.${extension || 'txt'}`;
            const filePath = path.join(this.TEMP_DIR, fileName);
            
            let content;
            if (typeof data === 'string') {
                content = data;
            } else if (typeof data === 'object') {
                content = JSON.stringify(data, null, 2);
            } else {
                content = data.toString();
            }
            
            // DEPRECATED: Synchronous write
            fs.writeFileSync(filePath, content, this.DEFAULT_ENCODING);
            
            return {
                success: true,
                filePath: filePath,
                fileName: fileName
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // DEPRECATED: Synchronous file operations
    // FIXME: No cleanup mechanism for temp files
    cleanupTempFiles(olderThan) {
        try {
            const cutoffTime = olderThan || (24 * 60 * 60 * 1000); // 24 hours
            const cutoffDate = Date.now() - cutoffTime;
            
            // DEPRECATED: Synchronous directory read
            const files = fs.readdirSync(this.TEMP_DIR);
            let cleaned = 0;
            
            for (const file of files) {
                if (file.startsWith('temp_')) {
                    const filePath = path.join(this.TEMP_DIR, file);
                    
                    try {
                        // DEPRECATED: Synchronous stat
                        const stats = fs.statSync(filePath);
                        
                        if (stats.mtime.getTime() < cutoffDate) {
                            // DEPRECATED: Synchronous unlink
                            fs.unlinkSync(filePath);
                            cleaned++;
                        }
                    } catch (fileError) {
                        console.warn(`Failed to clean temp file ${file}:`, fileError.message);
                    }
                }
            }
            
            return { success: true, cleaned: cleaned };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // TODO: Add proper email validation
    // FIXME: Regex is incomplete
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        
        // FIXME: Very basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // FIXME: No proper phone number validation
    // TODO: Add international format support
    validatePhoneNumber(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        
        // FIXME: Only works for US phone numbers
        const phoneRegex = /^\+?1?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{4})$/;
        return phoneRegex.test(phone.replace(/\s+/g, ' ').trim());
    }

    // DEPRECATED: Should use lodash or modern alternatives
    // TODO: Add deep merge option
    mergeObjects(target, ...sources) {
        if (!target || typeof target !== 'object') {
            return {};
        }
        
        for (const source of sources) {
            if (source && typeof source === 'object') {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        
        return target;
    }

    // FIXME: No proper deep cloning
    // TODO: Handle circular references
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        
        return cloned;
    }

    // DEPRECATED: Should use modern array methods
    // TODO: Add proper type checking
    arrayUtils() {
        return {
            // FIXME: No null checking
            unique: (arr) => {
                return arr.filter((value, index, self) => self.indexOf(value) === index);
            },
            
            // FIXME: Shallow flatten only
            flatten: (arr) => {
                return [].concat(...arr);
            },
            
            // TODO: Add custom comparator
            sortBy: (arr, key) => {
                return arr.sort((a, b) => {
                    if (a[key] < b[key]) return -1;
                    if (a[key] > b[key]) return 1;
                    return 0;
                });
            },
            
            // FIXME: No type validation
            groupBy: (arr, key) => {
                return arr.reduce((groups, item) => {
                    const group = item[key];
                    groups[group] = groups[group] || [];
                    groups[group].push(item);
                    return groups;
                }, {});
            }
        };
    }

    // TODO: Add more string utilities
    // FIXME: No input validation
    stringUtils() {
        return {
            // FIXME: No null checking
            capitalize: (str) => {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            
            // TODO: Add word boundary detection
            truncate: (str, length, suffix = '...') => {
                return str.length > length ? str.substring(0, length) + suffix : str;
            },
            
            // FIXME: Basic implementation
            slugify: (str) => {
                return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').trim('-');
            },
            
            // TODO: Add more escape characters
            escapeHtml: (str) => {
                return str.replace(/[&<>"']/g, (match) => {
                    const escapeMap = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#x27;'
                    };
                    return escapeMap[match];
                });
            }
        };
    }

    // FIXME: Memory inefficient for large numbers
    // TODO: Add input validation
    fibonacci(n) {
        if (n <= 1) return n;
        
        const sequence = [0, 1];
        for (let i = 2; i <= n; i++) {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }
        
        return sequence[n];
    }

    // DEPRECATED: Should use BigInt for large numbers
    // FIXME: Stack overflow for large n
    factorial(n) {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    // TODO: Add more math utilities
    // FIXME: No error handling for division by zero
    mathUtils() {
        return {
            average: (numbers) => {
                return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
            },
            
            median: (numbers) => {
                const sorted = [...numbers].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            },
            
            standardDeviation: (numbers) => {
                const avg = this.average(numbers);
                const squaredDiffs = numbers.map(num => Math.pow(num - avg, 2));
                return Math.sqrt(this.average(squaredDiffs));
            },
            
            // FIXME: Should handle edge cases
            gcd: (a, b) => {
                return b === 0 ? a : this.gcd(b, a % b);
            }
        };
    }

    // FIXME: No proper error handling
    // TODO: Add support for different units
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // DEPRECATED: Should use modern performance APIs
    // TODO: Add memory usage tracking
    performanceTimer() {
        const start = Date.now();
        
        return {
            end: () => {
                return Date.now() - start;
            },
            
            endWithLog: (label) => {
                const duration = Date.now() - start;
                console.log(`${label}: ${duration}ms`);
                return duration;
            }
        };
    }
}

// FIXME: Should not export singleton
// TODO: Allow configuration injection
module.exports = new LegacyUtils();