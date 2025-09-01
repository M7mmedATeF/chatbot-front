#!/bin/bash

echo "🚀 SSH Key Setup for GitHub Actions Deployment"
echo "=============================================="

# Generate SSH key pair
echo "📝 Generating SSH key pair..."
ssh-keygen -t rsa -b 4096 -C "github-actions-$(date +%s)@yourdomain.com" -f github_actions_key -N ""

echo ""
echo "✅ SSH key pair generated successfully!"
echo ""

echo "📋 Copy this PRIVATE KEY to GitHub Secrets (SSH_KEY):"
echo "===================================================="
cat github_actions_key
echo ""
echo "===================================================="
echo ""

echo "📋 Copy this PUBLIC KEY to your server (~/.ssh/authorized_keys):"
echo "================================================================="
cat github_actions_key.pub
echo ""
echo "================================================================="
echo ""

echo "🔧 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings → Secrets and variables → Actions"
echo "3. Add these secrets:"
echo "   - SSH_HOST: your-server.com (or IP address)"
echo "   - SSH_USER: your-ssh-username"
echo "   - SSH_KEY: (paste the private key above)"
echo "   - PROJECT_PATH: /path/to/your/deployment/directory"
echo ""
echo "4. On your server, add the public key to ~/.ssh/authorized_keys"
echo "5. Make sure the SSH user has write permissions to PROJECT_PATH"
echo ""

echo "🧹 Cleaning up local key files..."
rm github_actions_key github_actions_key.pub

echo "✨ Setup complete! Your keys have been displayed above and cleaned up locally."
