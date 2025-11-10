# REFACTORED: Imports organized, grouped, and unused imports removed
# Data Processor - Before Refactoring
# This code demonstrates multiple refactoring opportunities

import json
import csv
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
import requests
import pandas as pd
import numpy as np

class DataProcessor:
    def __init__(self, config):
        self.config = config
        self.data = []
        self.cache = {}
        
    # Long function that needs extraction
    def process_user_data(self, data_source, output_format):
        # Load data from various sources
        if data_source.endswith('.json'):
            with open(data_source, 'r') as f:
                raw_data = json.load(f)
        elif data_source.endswith('.csv'):
            raw_data = []
            with open(data_source, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    raw_data.append(row)
        elif data_source.endswith('.xml'):
            tree = ET.parse(data_source)
            root = tree.getroot()
            raw_data = []
            for item in root.findall('.//item'):
                data_item = {}
                for child in item:
                    data_item[child.tag] = child.text
                raw_data.append(data_item)
        elif data_source.startswith('http'):
            response = requests.get(data_source)
            if response.headers.get('content-type', '').startswith('application/json'):
                raw_data = response.json()
            else:
                raw_data = response.text.split('\n')
        else:
            raise ValueError('Unsupported data source format')
        
        # Clean and validate data
        cleaned_data = []
        for item in raw_data:
            if isinstance(item, dict):
                # Remove empty fields
                clean_item = {}
                for k, v in item.items():
                    if v is not None and v != '':
                        clean_item[k] = v
                
                # Validate required fields
                if 'id' not in clean_item or 'name' not in clean_item:
                    continue
                    
                # Normalize data types
                if 'age' in clean_item:
                    try:
                        clean_item['age'] = int(clean_item['age'])
                    except ValueError:
                        clean_item['age'] = 0
                        
                if 'email' in clean_item:
                    clean_item['email'] = clean_item['email'].lower().strip()
                    if '@' not in clean_item['email']:
                        continue
                        
                if 'phone' in clean_item:
                    clean_item['phone'] = ''.join(filter(str.isdigit, clean_item['phone']))
                    
                if 'created_at' in clean_item:
                    try:
                        clean_item['created_at'] = datetime.strptime(clean_item['created_at'], '%Y-%m-%d')
                    except ValueError:
                        clean_item['created_at'] = datetime.now()
                        
                cleaned_data.append(clean_item)
        
        # Process and enrich data
        processed_data = []
        for item in cleaned_data:
            processed_item = item.copy()
            
            # Add derived fields
            if 'age' in processed_item:
                if processed_item['age'] < 18:
                    processed_item['category'] = 'minor'
                elif processed_item['age'] < 65:
                    processed_item['category'] = 'adult'
                else:
                    processed_item['category'] = 'senior'
            
            # Add geographical data
            if 'country' in processed_item:
                if processed_item['country'].upper() in ['US', 'USA', 'UNITED STATES']:
                    processed_item['continent'] = 'North America'
                    processed_item['timezone'] = 'EST'
                elif processed_item['country'].upper() in ['UK', 'GB', 'UNITED KINGDOM']:
                    processed_item['continent'] = 'Europe'
                    processed_item['timezone'] = 'GMT'
                elif processed_item['country'].upper() in ['KR', 'KOREA', 'SOUTH KOREA']:
                    processed_item['continent'] = 'Asia'
                    processed_item['timezone'] = 'KST'
            
            processed_data.append(processed_item)
        
        # Sort data
        if 'sort_by' in self.config:
            sort_field = self.config['sort_by']
            if sort_field in processed_data[0] if processed_data else {}:
                processed_data.sort(key=lambda x: x.get(sort_field, 0))
        
        # Output data
        if output_format == 'json':
            with open('output.json', 'w') as f:
                json.dump(processed_data, f, indent=2, default=str)
        elif output_format == 'csv':
            if processed_data:
                fieldnames = list(processed_data[0].keys())
                with open('output.csv', 'w', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    for item in processed_data:
                        writer.writerow(item)
        elif output_format == 'xml':
            root = ET.Element('data')
            for item in processed_data:
                item_elem = ET.SubElement(root, 'item')
                for k, v in item.items():
                    field_elem = ET.SubElement(item_elem, k)
                    field_elem.text = str(v)
            tree = ET.ElementTree(root)
            tree.write('output.xml', encoding='utf-8', xml_declaration=True)
        
        return processed_data

    # Duplicated validation logic
    def validate_user_input(self, user_data):
        errors = []
        
        if not user_data.get('email'):
            errors.append('Email is required')
        elif '@' not in user_data['email']:
            errors.append('Invalid email format')
        
        if not user_data.get('name'):
            errors.append('Name is required')
        elif len(user_data['name']) < 2:
            errors.append('Name too short')
        
        if user_data.get('age'):
            try:
                age = int(user_data['age'])
                if age < 0 or age > 150:
                    errors.append('Invalid age range')
            except ValueError:
                errors.append('Age must be a number')
        
        return errors

    # More duplicated validation logic
    def validate_admin_input(self, admin_data):
        errors = []
        
        if not admin_data.get('email'):
            errors.append('Email is required')
        elif '@' not in admin_data['email']:
            errors.append('Invalid email format')
        
        if not admin_data.get('name'):
            errors.append('Name is required')
        elif len(admin_data['name']) < 2:
            errors.append('Name too short')
        
        if not admin_data.get('role'):
            errors.append('Role is required')
        elif admin_data['role'] not in ['admin', 'super_admin']:
            errors.append('Invalid role')
        
        if admin_data.get('permissions'):
            valid_permissions = ['read', 'write', 'delete', 'admin']
            for perm in admin_data['permissions']:
                if perm not in valid_permissions:
                    errors.append(f'Invalid permission: {perm}')
        
        return errors

    # Poor naming and complex conditionals
    def proc_data_by_type(self, d, t, opts=None):
        if opts is None:
            opts = {}
            
        if t == 1:
            if d['status'] == 'active' and d['verified'] == True and d['age'] >= 18:
                if opts.get('premium') and d.get('payment_status') == 'paid':
                    d['access_level'] = 'premium'
                elif opts.get('standard') and d.get('last_login'):
                    last_login = datetime.strptime(d['last_login'], '%Y-%m-%d')
                    if (datetime.now() - last_login).days < 30:
                        d['access_level'] = 'standard'
                    else:
                        d['access_level'] = 'limited'
                else:
                    d['access_level'] = 'basic'
            else:
                d['access_level'] = 'none'
        elif t == 2:
            if d['role'] == 'admin' or d['role'] == 'super_admin':
                if d.get('two_factor_enabled') and d.get('last_security_check'):
                    check_date = datetime.strptime(d['last_security_check'], '%Y-%m-%d')
                    if (datetime.now() - check_date).days < 7:
                        d['admin_access'] = 'full'
                    else:
                        d['admin_access'] = 'limited'
                else:
                    d['admin_access'] = 'restricted'
            else:
                d['admin_access'] = 'none'
        
        return d

    # Missing error handling and performance issues
    def analyze_user_patterns(self, user_list):
        patterns = {}
        
        for user in user_list:
            # This could fail if user doesn't have required fields
            age_group = user['age'] // 10 * 10
            country = user['country']
            
            if age_group not in patterns:
                patterns[age_group] = {}
            
            if country not in patterns[age_group]:
                patterns[age_group][country] = []
            
            patterns[age_group][country].append(user)
        
        # Inefficient computation
        for age_group in patterns:
            for country in patterns[age_group]:
                users = patterns[age_group][country]
                total_users = len(users)
                active_users = len([u for u in users if u['status'] == 'active'])
                avg_login_freq = sum([u.get('login_frequency', 0) for u in users]) / total_users
                
                patterns[age_group][country] = {
                    'total': total_users,
                    'active': active_users,
                    'avg_login_freq': avg_login_freq,
                    'users': users
                }
        
        return patterns

    # Unorganized imports and unused functions
    def unused_function(self):
        import os
        import sys
        from collections import defaultdict
        
        data = defaultdict(list)
        return data

    # No error handling and poor performance
    def fetch_external_data(self, urls):
        results = []
        
        for url in urls:
            response = requests.get(url)  # No timeout, no error handling
            data = response.json()
            
            # Process each item individually (inefficient)
            for item in data:
                processed = self.process_single_item(item)
                results.append(processed)
        
        return results
    
    def process_single_item(self, item):
        # Expensive operation done for each item
        processed = {}
        for k, v in item.items():
            if isinstance(v, str):
                processed[k] = v.upper().strip()
            elif isinstance(v, (int, float)):
                processed[k] = v * 1.1  # Some business logic
            else:
                processed[k] = str(v)
        return processed