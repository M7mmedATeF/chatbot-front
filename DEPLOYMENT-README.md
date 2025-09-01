# 🚀 GitHub Actions Deployment Setup

This guide will help you set up automated deployment of your React app to a server using GitHub Actions.

## 📋 Prerequisites

- A server with SSH access
- GitHub repository with your React project
- Node.js and npm installed on your server (optional, since we're deploying built files)

## 🔐 GitHub Secrets Setup

You need to configure these secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

### Required Secrets:

- **`SSH_HOST`**: Your server hostname or IP address (e.g., `your-server.com` or `192.168.1.100`)
- **`SSH_USER`**: SSH username for server access
- **`SSH_KEY`**: Private SSH key (see setup script below)
- **`PROJECT_PATH`**: Full path on server where you want to deploy (e.g., `/var/www/html/chat-app`)

## 🔑 SSH Key Generation

Run the provided setup script to generate SSH keys:

```bash
chmod +x setup-ssh.sh
./setup-ssh.sh
```

This will:

1. Generate a new SSH key pair
2. Display the private key (copy to `SSH_KEY` secret)
3. Display the public key (add to your server's `~/.ssh/authorized_keys`)
4. Clean up local key files

## 🖥️ Server Setup

1. **Add the public key to your server:**

   ```bash
   # On your server
   echo "your-public-key-here" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Create the deployment directory:**

   ```bash
   # On your server
   sudo mkdir -p /path/to/your/deployment/directory
   sudo chown $USER:$USER /path/to/your/deployment/directory
   ```

3. **Ensure SSH access works:**
   ```bash
   # Test from your local machine
   ssh -i ~/.ssh/your-private-key your-user@your-server.com
   ```

## 🔄 Workflow Triggers

The deployment workflow will trigger on:

- ✅ Push to the `dev` branch
- ✅ Manual trigger via GitHub Actions UI

## 📁 Deployment Structure

After deployment, your server will have:

```
/your/project/path/
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── icons/
└── ...
```

## 🚨 Troubleshooting

### Common Issues:

1. **"SSH_KEY secret is not set"**

   - Make sure you've added all required secrets in GitHub
   - Check that secret names match exactly: `SSH_KEY`, `SSH_HOST`, `SSH_USER`, `PROJECT_PATH`

2. **"Permission denied" during SSH**

   - Verify the public key is correctly added to `~/.ssh/authorized_keys` on your server
   - Check that the SSH user has write permissions to the deployment directory

3. **"Host key verification failed"**

   - The workflow automatically adds host keys, but you might need to manually verify the first time

4. **Build fails**
   - Check that your `package.json` has the correct build script
   - Ensure all dependencies are properly listed

### Debug Mode:

You can temporarily add debug logging by modifying the workflow:

```yaml
- name: Debug SSH connection
  run: |
    echo "Testing SSH connection..."
    ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "echo 'SSH connection successful'"
```

## 📊 Workflow Features

- **Automated backups**: Creates timestamped backups before deployment
- **Verification**: Checks that key files were deployed successfully
- **Caching**: Node.js dependencies are cached for faster builds
- **Security**: Uses SSH with key-based authentication
- **Reliability**: Uses `rsync` for efficient file synchronization

## 🎯 Manual Deployment

You can also trigger deployments manually:

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Select "Build and Deploy to Server" workflow
4. Click **"Run workflow"** button

---

Happy deploying! 🎉
