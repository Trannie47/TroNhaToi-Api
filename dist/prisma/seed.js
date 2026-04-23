"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const existingAdmin = await prisma.user.findFirst({
        where: {
            OR: [
                { username: 'admin' },
                { email: 'admin@nhatro.com' }
            ]
        }
    });
    if (existingAdmin) {
        console.log('Admin đã tồn tại, bỏ qua...');
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminadmin', salt);
    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            email: `admin@${process.env.DOMAIN || 'nhatro.com'}`,
            password: hashedPassword,
            role: 'admin',
        }
    });
    console.log(`✅ Đã tạo admin: ${admin.username} / ${admin.email}`);
    console.log(`🔑 Mật khẩu mặc định: adminadmin`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map