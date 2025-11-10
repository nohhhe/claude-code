const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const _ = require('lodash');
const request = require('request'); // DEPRECATED: Should use axios or fetch
const async = require('async'); // DEPRECATED: Should use modern async/await
const moment = require('moment'); // DEPRECATED: Should use dayjs or date-fns

// FIXME: This file is getting too large - should be split into multiple modules
// TODO: Add proper error handling
// TODO: Add input validation
// TODO: Add logging
// FIXME: No proper configuration management
// TODO: Move constants to config file
// FIXME: Hardcoded values everywhere

const JWT_SECRET = 'super-secret-key-that-should-be-in-env'; // SECURITY ISSUE
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '24h';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// FIXME: Should use proper schema validation
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    address: Object,
    preferences: Object,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    profilePicture: String,
    bio: String,
    socialLinks: Object,
    settings: Object,
    notifications: Object,
    subscription: Object,
    paymentInfo: Object,
    activityLog: Array,
    friends: Array,
    blockedUsers: Array,
    favoriteItems: Array,
    shoppingCart: Array,
    wishList: Array,
    orderHistory: Array,
    reviews: Array,
    ratings: Object,
    badges: Array,
    achievements: Array,
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    referralCode: String,
    referredBy: String,
    referralCount: { type: Number, default: 0 },
    location: Object,
    timezone: String,
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    twoFactorAuth: Object,
    securityQuestions: Array,
    deviceInfo: Array,
    sessions: Array,
    apiKeys: Array,
    webhooks: Array,
    integrations: Object,
    customFields: Object,
    tags: Array,
    notes: String,
    priority: String,
    status: String,
    department: String,
    manager: String,
    employees: Array,
    projects: Array,
    tasks: Array,
    documents: Array,
    permissions: Object,
    groups: Array,
    channels: Array,
    conversations: Array,
    files: Array,
    calendar: Object,
    meetings: Array,
    reminders: Array,
    bookmarks: Array,
    searches: Array,
    analytics: Object,
    metrics: Object,
    reports: Array,
    exports: Array,
    imports: Array,
    backups: Array,
    logs: Array,
    errors: Array,
    warnings: Array,
    debugInfo: Object,
    performance: Object,
    monitoring: Object,
    alerts: Array,
    incidents: Array,
    maintenance: Object,
    migrations: Array,
    versions: Array,
    features: Object,
    experiments: Object,
    ab_tests: Array,
    feedback: Array,
    surveys: Array,
    testimonials: Array,
    support_tickets: Array,
    knowledge_base: Array,
    faqs: Array,
    tutorials: Array,
    guides: Array,
    documentation: Array,
    resources: Array,
    links: Array,
    bookmarks_external: Array,
    subscriptions_external: Array,
    partnerships: Array,
    affiliates: Array,
    commissions: Object,
    payouts: Array,
    invoices: Array,
    receipts: Array,
    transactions: Array,
    balance: Number,
    wallet: Object,
    bank_accounts: Array,
    credit_cards: Array,
    payment_methods: Array,
    billing_address: Object,
    shipping_addresses: Array,
    delivery_preferences: Object,
    communication_preferences: Object,
    privacy_settings: Object,
    security_settings: Object,
    notification_settings: Object,
    display_settings: Object,
    accessibility_settings: Object,
    theme_preferences: Object,
    layout_preferences: Object,
    dashboard_widgets: Array,
    shortcuts: Array,
    bookmarks_internal: Array,
    recent_activities: Array,
    recent_searches: Array,
    recent_views: Array,
    recommendations: Array,
    suggestions: Array,
    tips: Array,
    tutorials_completed: Array,
    onboarding_status: Object,
    tour_progress: Object,
    help_requests: Array,
    feature_requests: Array,
    bug_reports: Array,
    improvement_suggestions: Array,
    beta_features: Array,
    early_access: Array,
    special_offers: Array,
    promotions: Array,
    discounts: Array,
    coupons: Array,
    gift_cards: Array,
    loyalty_program: Object,
    rewards: Array,
    cashback: Object,
    referral_rewards: Array,
    milestone_rewards: Array,
    seasonal_rewards: Array,
    contest_entries: Array,
    lottery_entries: Array,
    raffle_entries: Array,
    sweepstakes_entries: Array,
    competition_results: Array,
    leaderboard_positions: Array,
    rankings: Object,
    scores: Object,
    statistics: Object,
    analytics_personal: Object,
    insights: Array,
    trends: Array,
    predictions: Array,
    forecasts: Array,
    recommendations_ai: Array,
    ml_models: Array,
    ai_preferences: Object,
    automation_rules: Array,
    workflows: Array,
    triggers: Array,
    actions: Array,
    conditions: Array,
    schedules: Array,
    timers: Array,
    counters: Array,
    flags: Array,
    markers: Array,
    labels: Array,
    categories: Array,
    classifications: Array,
    hierarchies: Array,
    relationships: Array,
    connections: Array,
    networks: Array,
    graphs: Array,
    trees: Array,
    lists: Array,
    sets: Array,
    maps: Array,
    dictionaries: Array,
    tables: Array,
    matrices: Array,
    vectors: Array,
    tensors: Array,
    embeddings: Array,
    features_ml: Array,
    models_trained: Array,
    predictions_history: Array,
    accuracy_scores: Array,
    confidence_intervals: Array,
    uncertainty_measures: Array,
    explainability_data: Array,
    fairness_metrics: Array,
    bias_detection: Array,
    drift_monitoring: Array,
    anomaly_detection: Array,
    outlier_detection: Array,
    clustering_results: Array,
    segmentation_data: Array,
    cohort_analysis: Array,
    funnel_analysis: Array,
    retention_analysis: Array,
    churn_analysis: Array,
    lifetime_value: Object,
    acquisition_cost: Object,
    conversion_rates: Object,
    engagement_metrics: Object,
    usage_patterns: Object,
    behavior_analysis: Object,
    sentiment_analysis: Array,
    emotion_detection: Array,
    intent_recognition: Array,
    entity_extraction: Array,
    keyword_extraction: Array,
    topic_modeling: Array,
    text_classification: Array,
    language_detection: Array,
    translation_history: Array,
    localization_preferences: Object,
    cultural_adaptations: Array,
    regional_variations: Array,
    compliance_data: Array,
    audit_trails: Array,
    governance_records: Array,
    policy_acknowledgments: Array,
    consent_records: Array,
    data_processing_agreements: Array,
    privacy_notices: Array,
    terms_acceptances: Array,
    cookie_preferences: Object,
    tracking_preferences: Object,
    advertising_preferences: Object,
    marketing_permissions: Object,
    communication_consents: Object,
    data_retention_settings: Object,
    deletion_requests: Array,
    portability_requests: Array,
    access_requests: Array,
    rectification_requests: Array,
    objection_records: Array,
    restriction_requests: Array,
    breach_notifications: Array,
    incident_reports: Array,
    vulnerability_assessments: Array,
    penetration_test_results: Array,
    security_scores: Object,
    risk_assessments: Array,
    threat_models: Array,
    attack_vectors: Array,
    mitigation_strategies: Array,
    recovery_plans: Array,
    backup_schedules: Array,
    restore_points: Array,
    snapshots: Array,
    checkpoints: Array,
    savepoints: Array,
    rollback_points: Array,
    version_history: Array,
    change_history: Array,
    modification_log: Array,
    creation_log: Array,
    deletion_log: Array,
    access_log: Array,
    view_log: Array,
    download_log: Array,
    upload_log: Array,
    share_log: Array,
    export_log: Array,
    import_log: Array,
    sync_log: Array,
    backup_log: Array,
    restore_log: Array,
    migration_log: Array,
    transformation_log: Array,
    validation_log: Array,
    verification_log: Array,
    authentication_log: Array,
    authorization_log: Array,
    session_log: Array,
    connection_log: Array,
    disconnection_log: Array,
    timeout_log: Array,
    error_log: Array,
    warning_log: Array,
    info_log: Array,
    debug_log: Array,
    trace_log: Array,
    performance_log: Array,
    memory_log: Array,
    cpu_log: Array,
    network_log: Array,
    disk_log: Array,
    bandwidth_log: Array,
    latency_log: Array,
    throughput_log: Array,
    capacity_log: Array,
    utilization_log: Array,
    availability_log: Array,
    reliability_log: Array,
    durability_log: Array,
    consistency_log: Array,
    integrity_log: Array,
    confidentiality_log: Array,
    authenticity_log: Array,
    non_repudiation_log: Array,
    accountability_log: Array,
    transparency_log: Array,
    auditability_log: Array,
    traceability_log: Array,
    provenance_log: Array,
    lineage_log: Array,
    dependency_log: Array,
    relationship_log: Array,
    hierarchy_log: Array,
    taxonomy_log: Array,
    ontology_log: Array,
    metadata_log: Array,
    schema_log: Array,
    structure_log: Array,
    format_log: Array,
    encoding_log: Array,
    compression_log: Array,
    encryption_log: Array,
    hashing_log: Array,
    signing_log: Array,
    verification_log_crypto: Array,
    certificate_log: Array,
    key_log: Array,
    token_log: Array,
    credential_log: Array,
    identity_log: Array,
    profile_log: Array,
    attribute_log: Array,
    claim_log: Array,
    assertion_log: Array,
    proof_log: Array,
    evidence_log: Array,
    witness_log: Array,
    testimony_log: Array,
    statement_log: Array,
    declaration_log: Array,
    acknowledgment_log: Array,
    confirmation_log: Array,
    approval_log: Array,
    rejection_log: Array,
    denial_log: Array,
    refusal_log: Array,
    acceptance_log: Array,
    agreement_log: Array,
    consent_log: Array,
    permission_log: Array,
    authorization_log_detailed: Array,
    delegation_log: Array,
    revocation_log: Array,
    suspension_log: Array,
    activation_log: Array,
    deactivation_log: Array,
    enablement_log: Array,
    disablement_log: Array,
    configuration_log: Array,
    customization_log: Array,
    personalization_log: Array,
    optimization_log: Array,
    tuning_log: Array,
    calibration_log: Array,
    adjustment_log: Array,
    correction_log: Array,
    refinement_log: Array,
    enhancement_log: Array,
    improvement_log: Array,
    upgrade_log: Array,
    downgrade_log: Array,
    patch_log: Array,
    fix_log: Array,
    repair_log: Array,
    maintenance_log: Array,
    service_log: Array,
    support_log: Array,
    help_log: Array,
    assistance_log: Array,
    guidance_log: Array,
    instruction_log: Array,
    tutorial_log: Array,
    training_log: Array,
    education_log: Array,
    learning_log: Array,
    skill_log: Array,
    competency_log: Array,
    qualification_log: Array,
    certification_log: Array,
    credential_validation_log: Array,
    accreditation_log: Array,
    recognition_log: Array,
    award_log: Array,
    achievement_log: Array,
    milestone_log: Array,
    goal_log: Array,
    objective_log: Array,
    target_log: Array,
    kpi_log: Array,
    metric_log: Array,
    measure_log: Array,
    indicator_log: Array,
    benchmark_log: Array,
    baseline_log: Array,
    threshold_log: Array,
    limit_log: Array,
    boundary_log: Array,
    constraint_log: Array,
    requirement_log: Array,
    specification_log: Array,
    standard_log: Array,
    guideline_log: Array,
    policy_log: Array,
    procedure_log: Array,
    process_log: Array,
    workflow_log: Array,
    pipeline_log: Array,
    chain_log: Array,
    sequence_log: Array,
    order_log: Array,
    priority_log: Array,
    queue_log: Array,
    stack_log: Array,
    buffer_log: Array,
    cache_log: Array,
    memory_cache_log: Array,
    disk_cache_log: Array,
    network_cache_log: Array,
    cdn_log: Array,
    proxy_log: Array,
    gateway_log: Array,
    router_log: Array,
    switch_log: Array,
    bridge_log: Array,
    hub_log: Array,
    node_log: Array,
    edge_log: Array,
    vertex_log: Array,
    link_log: Array,
    path_log: Array,
    route_log: Array,
    destination_log: Array,
    source_log: Array,
    origin_log: Array,
    endpoint_log: Array,
    interface_log: Array,
    port_log: Array,
    socket_log: Array,
    channel_log: Array,
    stream_log: Array,
    flow_log: Array,
    pipeline_data_log: Array,
    batch_log: Array,
    job_log: Array,
    task_log: Array,
    operation_log: Array,
    function_log: Array,
    method_log: Array,
    procedure_execution_log: Array,
    command_log: Array,
    instruction_execution_log: Array,
    query_log: Array,
    request_log: Array,
    response_log: Array,
    message_log: Array,
    notification_log: Array,
    alert_log: Array,
    event_log: Array,
    trigger_log: Array,
    signal_log: Array,
    interrupt_log: Array,
    exception_log: Array,
    fault_log: Array,
    failure_log: Array,
    crash_log: Array,
    hang_log: Array,
    deadlock_log: Array,
    timeout_detailed_log: Array,
    retry_log: Array,
    recovery_log: Array,
    restart_log: Array,
    shutdown_log: Array,
    startup_log: Array,
    initialization_log: Array,
    cleanup_log: Array,
    disposal_log: Array,
    destruction_log: Array,
    creation_detailed_log: Array,
    construction_log: Array,
    building_log: Array,
    assembly_log: Array,
    compilation_log: Array,
    linking_log: Array,
    loading_log: Array,
    execution_log: Array,
    runtime_log: Array,
    interpretation_log: Array,
    translation_log: Array,
    transformation_detailed_log: Array,
    conversion_log: Array,
    parsing_log: Array,
    analysis_log: Array,
    synthesis_log: Array,
    generation_log: Array,
    production_log: Array,
    manufacturing_log: Array,
    processing_log: Array,
    handling_log: Array,
    management_log: Array,
    administration_log: Array,
    governance_log: Array,
    control_log: Array,
    regulation_log: Array,
    supervision_log: Array,
    oversight_log: Array,
    monitoring_detailed_log: Array,
    surveillance_log: Array,
    observation_log: Array,
    inspection_log: Array,
    examination_log: Array,
    investigation_log: Array,
    research_log: Array,
    study_log: Array,
    analysis_detailed_log: Array,
    evaluation_log: Array,
    assessment_detailed_log: Array,
    measurement_log: Array,
    testing_log: Array,
    validation_detailed_log: Array,
    verification_detailed_log: Array,
    certification_detailed_log: Array,
    qualification_detailed_log: Array,
    authorization_final_log: Array,
    approval_detailed_log: Array,
    acceptance_detailed_log: Array,
    rejection_detailed_log: Array,
    termination_log: Array
});

const User = mongoose.model('User', UserSchema);

class UserService {
    constructor() {
        // FIXME: Should initialize properly
        this.cache = {};
        this.stats = {};
    }

    // CYCLOMATIC COMPLEXITY: 22 (Too high! Should be under 10)
    // TODO: Break this monster function into smaller pieces
    // FIXME: No proper error handling
    // FIXME: No input validation
    // TODO: Add logging
    async authenticateUser(username, password, rememberMe, deviceInfo, ipAddress, userAgent, location) {
        try {
            if (!username || !password) {
                return { success: false, message: 'Username and password required' };
            }

            let user = await User.findOne({ 
                $or: [{ username: username }, { email: username }] 
            });

            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (!user.isActive) {
                return { success: false, message: 'Account is deactivated' };
            }

            if (user.lockUntil && user.lockUntil > Date.now()) {
                return { success: false, message: 'Account is locked' };
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                user.loginAttempts = user.loginAttempts + 1;
                
                if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                    user.lockUntil = Date.now() + LOCK_TIME;
                }
                
                await user.save();
                return { success: false, message: 'Invalid password' };
            }

            if (user.loginAttempts > 0) {
                user.loginAttempts = 0;
                user.lockUntil = undefined;
            }

            user.lastLogin = new Date();
            
            if (deviceInfo) {
                if (!user.deviceInfo) {
                    user.deviceInfo = [];
                }
                user.deviceInfo.push({
                    ...deviceInfo,
                    lastUsed: new Date(),
                    ipAddress: ipAddress,
                    userAgent: userAgent,
                    location: location
                });
                
                if (user.deviceInfo.length > 10) {
                    user.deviceInfo = user.deviceInfo.slice(-10);
                }
            }

            let tokenExpiry = TOKEN_EXPIRY;
            if (rememberMe) {
                tokenExpiry = '30d';
            }

            const token = jwt.sign(
                { 
                    userId: user._id, 
                    username: user.username,
                    role: user.role,
                    loginTime: Date.now()
                },
                JWT_SECRET,
                { expiresIn: tokenExpiry }
            );

            if (!user.sessions) {
                user.sessions = [];
            }
            
            user.sessions.push({
                token: token,
                createdAt: new Date(),
                expiresAt: rememberMe ? 
                    moment().add(30, 'days').toDate() : 
                    moment().add(24, 'hours').toDate(),
                deviceInfo: deviceInfo,
                ipAddress: ipAddress,
                userAgent: userAgent,
                location: location,
                isActive: true
            });

            if (user.sessions.length > 5) {
                user.sessions = user.sessions.slice(-5);
            }

            await user.save();

            // DEPRECATED: Using callback-style async library
            async.parallel([
                (callback) => {
                    this.updateUserStats(user._id, 'login', callback);
                },
                (callback) => {
                    this.logUserActivity(user._id, 'login', { 
                        ipAddress, 
                        userAgent, 
                        location 
                    }, callback);
                },
                (callback) => {
                    this.sendLoginNotification(user, deviceInfo, callback);
                }
            ], (err, results) => {
                if (err) {
                    console.error('Error in parallel operations:', err);
                }
            });

            return {
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                token: token,
                expiresIn: tokenExpiry
            };

        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    }

    // CYCLOMATIC COMPLEXITY: 18 (Too high!)
    // TODO: Refactor this function
    // FIXME: Inconsistent validation
    async createUser(userData) {
        try {
            const { username, email, password, firstName, lastName, phoneNumber, role } = userData;

            // Basic validation - TODO: Use proper validation library like Joi
            if (!username) {
                return { success: false, message: 'Username is required' };
            }
            
            if (!email) {
                return { success: false, message: 'Email is required' };
            }
            
            if (!password) {
                return { success: false, message: 'Password is required' };
            }

            // TODO: Add email format validation
            // TODO: Add password strength validation
            
            const existingUser = await User.findOne({
                $or: [{ username: username }, { email: email }]
            });

            if (existingUser) {
                if (existingUser.username === username) {
                    return { success: false, message: 'Username already exists' };
                }
                if (existingUser.email === email) {
                    return { success: false, message: 'Email already exists' };
                }
            }

            // FIXME: Phone number validation is missing
            if (phoneNumber) {
                const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
                if (!phoneRegex.test(phoneNumber)) {
                    return { success: false, message: 'Invalid phone number format' };
                }
                
                const existingPhone = await User.findOne({ phoneNumber: phoneNumber });
                if (existingPhone) {
                    return { success: false, message: 'Phone number already in use' };
                }
            }

            const saltRounds = SALT_ROUNDS;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // TODO: Generate referral code
            const referralCode = this.generateReferralCode(username);

            const newUser = new User({
                username: username,
                email: email,
                password: hashedPassword,
                firstName: firstName || '',
                lastName: lastName || '',
                phoneNumber: phoneNumber || '',
                role: role || 'user',
                referralCode: referralCode,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                settings: {
                    theme: 'light',
                    language: 'en',
                    timezone: 'UTC',
                    notifications: {
                        email: true,
                        push: true,
                        sms: false
                    }
                },
                preferences: {
                    newsletter: false,
                    marketing: false,
                    analytics: false
                }
            });

            await newUser.save();

            // DEPRECATED: Using request library instead of axios
            // TODO: Move to proper service
            const welcomeEmailData = {
                to: email,
                subject: 'Welcome to our platform!',
                template: 'welcome',
                data: {
                    firstName: firstName,
                    username: username,
                    referralCode: referralCode
                }
            };

            request.post({
                url: 'http://email-service/send', // FIXME: Hardcoded URL
                json: welcomeEmailData
            }, (error, response, body) => {
                if (error) {
                    console.error('Failed to send welcome email:', error);
                    // TODO: Add to email queue for retry
                }
            });

            // FIXME: This should be in a separate service
            this.updateUserStats('total_users', 1);
            this.logUserActivity(newUser._id, 'registration', { source: 'direct' });

            return {
                success: true,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    role: newUser.role,
                    referralCode: newUser.referralCode,
                    createdAt: newUser.createdAt
                }
            };

        } catch (error) {
            console.error('User creation error:', error);
            return { success: false, message: 'Failed to create user' };
        }
    }

    // CYCLOMATIC COMPLEXITY: 19 (Too high!)
    // TODO: Split into multiple functions
    // FIXME: No proper error handling
    async updateUser(userId, updateData, requestingUserId, requestingUserRole) {
        try {
            if (!userId) {
                return { success: false, message: 'User ID is required' };
            }

            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            // FIXME: Authorization logic is too complex and scattered
            const canUpdate = this.canUserUpdate(userId, requestingUserId, requestingUserRole);
            if (!canUpdate.allowed) {
                return { success: false, message: canUpdate.reason };
            }

            const allowedFields = this.getAllowedUpdateFields(requestingUserRole, userId === requestingUserId);
            const sanitizedData = {};

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key)) {
                    // TODO: Add proper validation for each field
                    if (key === 'email') {
                        // FIXME: Email validation is incomplete
                        if (!value.includes('@')) {
                            return { success: false, message: 'Invalid email format' };
                        }
                        
                        const existingEmail = await User.findOne({ 
                            email: value, 
                            _id: { $ne: userId } 
                        });
                        if (existingEmail) {
                            return { success: false, message: 'Email already in use' };
                        }
                    }

                    if (key === 'username') {
                        const existingUsername = await User.findOne({ 
                            username: value, 
                            _id: { $ne: userId } 
                        });
                        if (existingUsername) {
                            return { success: false, message: 'Username already in use' };
                        }
                    }

                    if (key === 'password') {
                        // TODO: Add password strength validation
                        const saltRounds = SALT_ROUNDS;
                        sanitizedData[key] = await bcrypt.hash(value, saltRounds);
                    } else if (key === 'phoneNumber') {
                        // FIXME: Phone validation is inconsistent
                        if (value && !value.match(/^\+?[\d\s\-\(\)]+$/)) {
                            return { success: false, message: 'Invalid phone number' };
                        }
                        sanitizedData[key] = value;
                    } else if (key === 'preferences' || key === 'settings') {
                        // FIXME: No deep merge, just overwrites
                        sanitizedData[key] = { ...user[key], ...value };
                    } else {
                        sanitizedData[key] = value;
                    }
                }
            }

            sanitizedData.updatedAt = new Date();

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                sanitizedData,
                { new: true, runValidators: true }
            );

            // FIXME: Should be in a separate service
            this.logUserActivity(userId, 'profile_update', {
                updatedFields: Object.keys(sanitizedData),
                updatedBy: requestingUserId
            });

            return {
                success: true,
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    phoneNumber: updatedUser.phoneNumber,
                    role: updatedUser.role,
                    updatedAt: updatedUser.updatedAt
                }
            };

        } catch (error) {
            console.error('User update error:', error);
            return { success: false, message: 'Failed to update user' };
        }
    }

    // CYCLOMATIC COMPLEXITY: 16 (Too high!)
    // TODO: Refactor authorization logic
    canUserUpdate(targetUserId, requestingUserId, requestingUserRole) {
        if (!requestingUserId || !requestingUserRole) {
            return { allowed: false, reason: 'Authentication required' };
        }

        // Self-update
        if (targetUserId === requestingUserId) {
            return { allowed: true };
        }

        // Admin can update anyone
        if (requestingUserRole === 'admin') {
            return { allowed: true };
        }

        // Manager can update users in their department
        if (requestingUserRole === 'manager') {
            // TODO: Check if target user is in requesting user's department
            return { allowed: true }; // FIXME: Always returns true for now
        }

        // Supervisor can update basic user info
        if (requestingUserRole === 'supervisor') {
            return { allowed: true }; // FIXME: Should check permissions
        }

        // Support staff can update limited fields
        if (requestingUserRole === 'support') {
            return { allowed: true }; // FIXME: Should limit fields
        }

        return { allowed: false, reason: 'Insufficient permissions' };
    }

    // TODO: Make this configurable
    getAllowedUpdateFields(userRole, isSelfUpdate) {
        const baseFields = ['firstName', 'lastName', 'phoneNumber', 'bio', 'preferences', 'settings'];
        
        if (isSelfUpdate) {
            return [...baseFields, 'email', 'password', 'profilePicture'];
        }

        if (userRole === 'admin') {
            return [...baseFields, 'email', 'role', 'isActive', 'permissions'];
        }

        if (userRole === 'manager') {
            return [...baseFields, 'email', 'department'];
        }

        if (userRole === 'supervisor') {
            return baseFields;
        }

        if (userRole === 'support') {
            return ['firstName', 'lastName', 'phoneNumber'];
        }

        return [];
    }

    // FIXME: This function does too many things
    // TODO: Split into smaller functions
    async getUserProfile(userId, requestingUserId, requestingUserRole) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            // FIXME: Authorization logic is duplicated
            const canView = this.canUserView(userId, requestingUserId, requestingUserRole);
            if (!canView.allowed) {
                return { success: false, message: canView.reason };
            }

            const profileData = {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                bio: user.bio,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            };

            // FIXME: Field filtering logic is complex
            if (requestingUserRole === 'admin' || userId === requestingUserId) {
                profileData.preferences = user.preferences;
                profileData.settings = user.settings;
                profileData.activityLog = user.activityLog ? user.activityLog.slice(-10) : [];
            }

            if (requestingUserRole === 'admin') {
                profileData.loginAttempts = user.loginAttempts;
                profileData.lockUntil = user.lockUntil;
                profileData.sessions = user.sessions;
                profileData.deviceInfo = user.deviceInfo;
            }

            return { success: true, profile: profileData };

        } catch (error) {
            console.error('Get profile error:', error);
            return { success: false, message: 'Failed to get profile' };
        }
    }

    // TODO: Implement proper authorization
    canUserView(targetUserId, requestingUserId, requestingUserRole) {
        // FIXME: Too permissive for now
        return { allowed: true };
    }

    // DEPRECATED: Using synchronous crypto methods
    // TODO: Use proper UUID library
    generateReferralCode(username) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        const userPrefix = username.substr(0, 3).toUpperCase();
        return `${userPrefix}${timestamp}${random}`.toUpperCase();
    }

    // FIXME: No proper error handling
    // TODO: Use proper logging service
    updateUserStats(userId, action, callback) {
        if (typeof userId === 'string' && typeof action === 'number') {
            // FIXME: Confusing parameter overloading
            const statKey = userId;
            const increment = action;
            this.stats[statKey] = (this.stats[statKey] || 0) + increment;
        } else {
            if (!this.stats[action]) {
                this.stats[action] = 0;
            }
            this.stats[action]++;
        }

        if (callback) {
            callback(null, 'Stats updated');
        }
    }

    // TODO: Use proper logging service like Winston
    // FIXME: Callback-style when should be Promise-based
    logUserActivity(userId, activity, metadata, callback) {
        const logEntry = {
            userId: userId,
            activity: activity,
            metadata: metadata || {},
            timestamp: new Date(),
            ipAddress: metadata ? metadata.ipAddress : null,
            userAgent: metadata ? metadata.userAgent : null
        };

        // FIXME: Should persist to database
        console.log('User activity:', JSON.stringify(logEntry));

        // DEPRECATED: Using request library
        request.post({
            url: 'http://analytics-service/log', // FIXME: Hardcoded URL
            json: logEntry
        }, (error, response, body) => {
            if (error) {
                console.error('Failed to log activity:', error);
            }
            if (callback) {
                callback(error, body);
            }
        });
    }

    // FIXME: Should be in notification service
    // TODO: Add proper template system
    sendLoginNotification(user, deviceInfo, callback) {
        if (!user.settings || !user.settings.notifications || !user.settings.notifications.email) {
            if (callback) callback(null, 'Notifications disabled');
            return;
        }

        const emailData = {
            to: user.email,
            subject: 'New login detected',
            template: 'login_notification',
            data: {
                firstName: user.firstName,
                loginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                deviceInfo: deviceInfo,
                location: deviceInfo ? deviceInfo.location : 'Unknown'
            }
        };

        // DEPRECATED: Using request instead of proper HTTP client
        request.post({
            url: 'http://email-service/send',
            json: emailData
        }, (error, response, body) => {
            if (error) {
                console.error('Failed to send login notification:', error);
            }
            if (callback) {
                callback(error, body);
            }
        });
    }

    // FIXME: No pagination
    // TODO: Add filtering and sorting
    // CYCLOMATIC COMPLEXITY: 15 (At the limit)
    async getUserList(requestingUserId, requestingUserRole, filters, page, limit) {
        try {
            if (requestingUserRole !== 'admin' && requestingUserRole !== 'manager') {
                return { success: false, message: 'Insufficient permissions' };
            }

            let query = {};
            
            if (filters) {
                if (filters.role) {
                    query.role = filters.role;
                }
                if (filters.isActive !== undefined) {
                    query.isActive = filters.isActive;
                }
                if (filters.department) {
                    query.department = filters.department;
                }
                if (filters.createdAfter) {
                    query.createdAt = { $gte: new Date(filters.createdAfter) };
                }
                if (filters.createdBefore) {
                    if (query.createdAt) {
                        query.createdAt.$lte = new Date(filters.createdBefore);
                    } else {
                        query.createdAt = { $lte: new Date(filters.createdBefore) };
                    }
                }
                if (filters.search) {
                    query.$or = [
                        { username: { $regex: filters.search, $options: 'i' } },
                        { email: { $regex: filters.search, $options: 'i' } },
                        { firstName: { $regex: filters.search, $options: 'i' } },
                        { lastName: { $regex: filters.search, $options: 'i' } }
                    ];
                }
            }

            const pageNum = page || 1;
            const limitNum = limit || 20;
            const skip = (pageNum - 1) * limitNum;

            const users = await User.find(query)
                .select('username email firstName lastName role isActive createdAt lastLogin')
                .skip(skip)
                .limit(limitNum)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments(query);

            return {
                success: true,
                users: users,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: total,
                    pages: Math.ceil(total / limitNum)
                }
            };

        } catch (error) {
            console.error('Get user list error:', error);
            return { success: false, message: 'Failed to get user list' };
        }
    }

    // TODO: Add soft delete option
    // FIXME: No cascading delete handling
    async deleteUser(userId, requestingUserId, requestingUserRole, hardDelete = false) {
        try {
            if (requestingUserRole !== 'admin') {
                return { success: false, message: 'Only admins can delete users' };
            }

            if (userId === requestingUserId) {
                return { success: false, message: 'Cannot delete your own account' };
            }

            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (hardDelete) {
                await User.findByIdAndDelete(userId);
                // TODO: Clean up related data
                this.logUserActivity(requestingUserId, 'user_hard_delete', { deletedUserId: userId });
            } else {
                await User.findByIdAndUpdate(userId, { 
                    isActive: false, 
                    deletedAt: new Date(),
                    deletedBy: requestingUserId
                });
                this.logUserActivity(requestingUserId, 'user_soft_delete', { deletedUserId: userId });
            }

            return { success: true, message: 'User deleted successfully' };

        } catch (error) {
            console.error('Delete user error:', error);
            return { success: false, message: 'Failed to delete user' };
        }
    }

    // DEPRECATED: Should use proper password reset tokens
    // FIXME: No rate limiting
    // TODO: Add email verification
    async resetPassword(email, newPassword) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                // SECURITY: Don't reveal if email exists
                return { success: true, message: 'If the email exists, a reset link has been sent' };
            }

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            
            await User.findByIdAndUpdate(user._id, { 
                password: hashedPassword,
                updatedAt: new Date()
            });

            // TODO: Invalidate all existing sessions
            // TODO: Send confirmation email

            this.logUserActivity(user._id, 'password_reset', { method: 'direct' });

            return { success: true, message: 'Password reset successful' };

        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, message: 'Password reset failed' };
        }
    }

    // FIXME: Token verification is weak
    // TODO: Add proper JWT validation
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive) {
                return { valid: false, message: 'User not found or inactive' };
            }

            // TODO: Check if session exists and is active
            const session = user.sessions ? user.sessions.find(s => s.token === token && s.isActive) : null;
            if (!session) {
                return { valid: false, message: 'Session not found' };
            }

            return { 
                valid: true, 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    role: user.role 
                } 
            };

        } catch (error) {
            return { valid: false, message: 'Invalid token' };
        }
    }

    // TODO: Add proper cache invalidation
    // FIXME: Memory leak potential with unlimited cache growth
    getCachedUser(userId) {
        return this.cache[userId];
    }

    setCachedUser(userId, userData) {
        this.cache[userId] = userData;
        // FIXME: No TTL, cache grows indefinitely
    }

    // DEPRECATED: Synchronous operation in async context
    // TODO: Make this async
    clearUserCache(userId) {
        delete this.cache[userId];
    }

    // TODO: Implement proper health check
    getServiceHealth() {
        return {
            status: 'ok', // FIXME: Always returns ok
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            stats: this.stats,
            cacheSize: Object.keys(this.cache).length
        };
    }
}

module.exports = new UserService();