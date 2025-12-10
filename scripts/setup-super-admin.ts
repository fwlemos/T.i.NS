import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const SUPER_ADMIN_EMAIL = 'info@tennessine.com.br'

/**
 * Creates the initial super admin account.
 * This script should be run once during initial deployment.
 * 
 * SECURITY: Password is prompted at runtime and never stored.
 */
async function setupSuperAdmin() {
    // Prompt for password (not stored anywhere)
    const password = await promptForPassword(
        'Enter password for super admin (info@tennessine.com.br): '
    )

    if (!password || password.length < 8) {
        console.error('Password must be at least 8 characters')
        process.exit(1)
    }

    // Confirm password
    const confirmPassword = await promptForPassword('Confirm password: ')

    if (password !== confirmPassword) {
        console.error('Passwords do not match')
        process.exit(1)
    }

    // Use service role for admin creation (from environment)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Error: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.')
        process.exit(1)
    }

    const supabaseAdmin = createClient(
        supabaseUrl,
        supabaseServiceKey
    )

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: SUPER_ADMIN_EMAIL,
        password: password,
        email_confirm: true,
    })

    // Handle case where user might already exist
    let userId = authData.user?.id

    if (authError) {
        // If user already exists, we might want to attach the profile/role anyway
        if (authError.message.includes('already been registered')) {
            console.log('User already exists. Fetching ID...')
            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = existingUsers.users.find(u => u.email === SUPER_ADMIN_EMAIL)
            if (existingUser) {
                userId = existingUser.id
            } else {
                console.error('Could not find existing user ID.')
                process.exit(1)
            }
        } else {
            console.error('Failed to create auth user:', authError.message)
            process.exit(1)
        }
    }

    if (!userId) {
        console.error('No user ID found.')
        process.exit(1)
    }

    // Get admin role ID
    const { data: adminRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single()

    if (!adminRole) {
        console.error('Admin role not found. Did you run the seed migration?')
        process.exit(1)
    }

    // Create or Update profile
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
        id: userId,
        full_name: 'Super Admin',
        role_id: adminRole.id,
        is_active: true,
    })

    if (profileError) {
        console.error('Failed to create/update profile:', profileError.message)
        process.exit(1)
    }

    console.log('✅ Super admin created/updated successfully')
    console.log(`   Email: ${SUPER_ADMIN_EMAIL}`)
    console.log('   Role: admin')
    console.log('')
    console.log('⚠️  Please store the password securely. It is not saved anywhere.')

    // Clear password from memory
    process.exit(0)
}

function promptForPassword(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise((resolve) => {
        // Hide password input
        process.stdout.write(prompt)

        let password = ''
        process.stdin.setRawMode(true)
        process.stdin.resume()
        process.stdin.on('data', (char) => {
            const c = char.toString()
            if (c === '\n' || c === '\r') {
                process.stdin.setRawMode(false)
                process.stdout.write('\n')
                rl.close()
                resolve(password)
            } else if (c === '\u0003') {
                process.exit()
            } else if (c === '\u007f') {
                password = password.slice(0, -1)
                process.stdout.clearLine(0)
                process.stdout.cursorTo(0)
                process.stdout.write(prompt + '*'.repeat(password.length))
            } else {
                password += c
                process.stdout.write('*')
            }
        })
    })
}

setupSuperAdmin()
