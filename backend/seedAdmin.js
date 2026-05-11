require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function seedAdmin() {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: 'admin@cinemabook.com' });
    if (existing) {
        console.log('✅ Admin already exists: admin@cinemabook.com / admin123');
        process.exit(0);
    }

    await Admin.create({
        name: 'Super Admin',
        email: 'admin@cinemabook.com',
        password: 'admin123',
        role: 'superadmin',
    });

    console.log('✅ Admin created!');
    console.log('   Email:    admin@cinemabook.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  Change this password before going live!');
    process.exit(0);
}

seedAdmin().catch(err => { console.error(err); process.exit(1); });
