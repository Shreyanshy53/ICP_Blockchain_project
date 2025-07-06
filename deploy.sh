#!/bin/bash

# ICP Scholar Deployment Script

echo "🚀 Starting ICP Scholar deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install the DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Start local replica if not running
echo "🔄 Starting local Internet Computer replica..."
dfx start --background --clean

# Deploy all canisters
echo "📦 Deploying backend canisters..."

echo "  - Deploying user_management canister..."
dfx deploy user_management

echo "  - Deploying course_management canister..."
dfx deploy course_management

echo "  - Deploying certificate_issuer canister..."
dfx deploy certificate_issuer

echo "  - Deploying token_rewards canister..."
dfx deploy token_rewards

echo "  - Deploying peer_learning canister..."
dfx deploy peer_learning

# Build frontend
echo "🏗️  Building frontend..."
npm run build

# Deploy frontend
echo "🌐 Deploying frontend..."
dfx deploy icp_scholar_frontend

# Get canister IDs
echo "📋 Canister Information:"
echo "========================"
dfx canister id user_management
dfx canister id course_management
dfx canister id certificate_issuer
dfx canister id token_rewards
dfx canister id peer_learning
dfx canister id icp_scholar_frontend

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Frontend URL: http://localhost:4943/?canisterId=$(dfx canister id icp_scholar_frontend)"
echo ""
echo "📚 To interact with the backend canisters, use:"
echo "   dfx canister call <canister_name> <function_name> '(<arguments>)'"
echo ""
echo "🔧 Example commands:"
echo "   dfx canister call user_management create_user '(record { role = variant { Learner }; name = \"John Doe\"; email = \"john@example.com\"; avatar = null })'"
echo "   dfx canister call course_management get_all_courses '()'"
echo ""