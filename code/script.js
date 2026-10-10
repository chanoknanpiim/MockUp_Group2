/**
 * Plod-Ploi Mockup Interaction Logic
 */

// ข้อมูลคำอธิบายของแต่ละหน้าจอ (อ้างอิงจาก PDF)
const screenDescriptions = {
    'screen-welcome': {
        title: "1. Welcome & LINE Rich Menu",
        objective: "หน้าต้อนรับเมื่อผู้ใช้แอด LINE Bot และแสดงช่องทางหลักในการเข้าถึงฟีเจอร์",
        features: [
            "ข้อความทักทายอัตโนมัติจาก Bot",
            "Rich Menu ที่แบ่งพื้นที่กดชัดเจน เพื่อเข้าถึง 3 ฟีเจอร์หลัก"
        ],
        usage: "ผู้ใช้สามารถคลิกเมนูบน Rich Menu ด้านล่าง เพื่อทดลองเปลี่ยนหน้าจอไปยังฟีเจอร์ต่างๆ ได้"
    },
    'screen-location': {
        title: "2. Location Request (ขอตำแหน่ง)",
        objective: "ขอรับพิกัดปัจจุบันของผู้ใช้เพื่อนำไปคำนวณระยะทางหาห้องน้ำที่ใกล้ที่สุด[cite: 2]",
        features: [
            "ปุ่ม Quick Reply ขอพิกัดที่ติดมากับข้อความ Bot"
        ],
        usage: "จำลองการกดปุ่ม 'แชร์ตำแหน่งที่ตั้ง' เพื่อดูผลลัพธ์การค้นหา"
    },
    'screen-results': {
        title: "3. Search Results (Flex Message)",
        objective: "แสดงห้องน้ำที่ใกล้ที่สุด 3 อันดับแรก[cite: 2]",
        features: [
            "แสดงผลแบบ Carousel เลื่อนซ้ายขวาได้",
            "บอกรายละเอียด: ชื่อตึก, ชั้น, ระยะทาง, สถานะปัจจุบัน[cite: 2, 3]",
            "แสดงไอคอนสิ่งอำนวยความสะดวก เช่น สายฉีดชำระ[cite: 2]"
        ],
        usage: "สามารถเลื่อนดูการ์ดห้องน้ำ และคลิกปุ่ม 'นำทางไปที่นี่' ได้"
    },
    'screen-filter': {
        title: "4. Filter Search (LIFF App)",
        objective: "ระบบตัวกรองสิ่งอำนวยความสะดวกเฉพาะ[cite: 2]",
        features: [
            "เปิดขึ้นมาเป็นหน้า Web App ภายใน LINE (LIFF)",
            "สามารถติ๊กเลือกตัวกรองได้มากกว่า 1 ตัวเลือก[cite: 3] เช่น มีสายฉีดชำระ, แยกเพศ[cite: 3]"
        ],
        usage: "ทดลองคลิกเลือก Checkbox และกดปุ่มค้นหา"
    },
    'screen-report': {
        title: "5. Report & Review (LIFF App)",
        objective: "ระบบรายงานสถานะและให้คะแนนความสะอาด เพื่อเป็นข้อมูล Crowdsourcing[cite: 3]",
        features: [
            "เลือกแจ้งสถานะ: ปกติ, ทำความสะอาด, หรือ ชำรุด (Out of Service)[cite: 3]",
            "ให้คะแนนดาว 1-5 ดาว[cite: 3]",
            "พิมพ์ข้อความรีวิว[cite: 3]"
        ],
        usage: "ทดลองกรอกฟอร์ม เลือกดาว และกดปุ่มส่งรายงาน"
    },
    'screen-success': {
        title: "6. Success State",
        objective: "ยืนยันการทำรายการสำเร็จเมื่อส่งรีวิวหรือแจ้งปัญหา",
        features: ["ข้อความขอบคุณ และปุ่มกลับสู่หน้าหลัก"],
        usage: "คลิก 'กลับสู่หน้าหลัก' เพื่อรีเซ็ต Flow"
    },
    'screen-error': {
        title: "7. Error / Empty State",
        objective: "รองรับกรณีผู้ใช้กำหนดตัวกรองแคบเกินไปจนไม่พบห้องน้ำในระบบ",
        features: ["ข้อความแจ้งเตือนอย่างเป็นมิตร และปุ่มกลับไปแก้ไขตัวกรอง"],
        usage: "คลิก 'แก้ไขตัวกรอง' เพื่อย้อนกลับไปหน้า Filter"
    }
};

const app = {
    init() {
        this.bindSidebarEvents();
        this.bindStarRating();
        this.bindModalEvents();
        // แสดงหน้าแรกเริ่มต้น
        this.navigate('screen-welcome');
    },

    bindModalEvents() {
        // ปุ่มปิด modal
        const closeBtn = document.getElementById('desc-modal-close');
        if(closeBtn) {
            closeBtn.addEventListener('click', () => this.hideDescModal());
        }
        // กดพื้นหลัง overlay ปิด modal
        const overlay = document.getElementById('desc-modal-overlay');
        if(overlay) {
            overlay.addEventListener('click', (e) => {
                if(e.target === overlay) this.hideDescModal();
            });
        }
    },

    bindSidebarEvents() {
        const buttons = document.querySelectorAll('#nav-menu button');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                this.navigate(targetId);
            });
        });
    },

    bindStarRating() {
        const stars = document.querySelectorAll('.star-rating .star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach(s => s.classList.remove('active'));
                for(let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });
        });
    },

    navigate(screenId) {
        // 1. ซ่อนทุกหน้าจอ
        document.querySelectorAll('.screen-view').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });

        // 2. แสดงหน้าจอเป้าหมาย
        const targetScreen = document.getElementById(screenId);
        if(targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }

        // 3. จัดการ UI ของ Header (แชต vs LIFF)
        const header = document.getElementById('dynamic-header');
        const closeBtn = document.getElementById('liff-close-btn');
        const isLiff = targetScreen.classList.contains('liff-view');
        
        if(isLiff) {
            header.style.backgroundColor = '#FFFFFF';
            header.style.color = '#333333';
            closeBtn.style.display = 'inline-block';
            closeBtn.onclick = () => this.navigate('screen-welcome');
        } else {
            header.style.backgroundColor = '#1E459F';
            header.style.color = '#FFFFFF';
            closeBtn.style.display = 'none';
        }

        // 4. อัปเดต Sidebar Active State + auto-scroll บน mobile
        document.querySelectorAll('#nav-menu button').forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-target') === screenId) {
                btn.classList.add('active');
                if(window.innerWidth <= 768) {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        });

        // 5. อัปเดตคำอธิบาย
        this.updateDescription(screenId);

        // 6. บน mobile → เปิด modal คำอธิบายทุกครั้งที่เปลี่ยนหน้า
        if(window.innerWidth <= 768) {
            this.showDescModal();
        }
    },

    updateDescription(screenId) {
        const panel = document.getElementById('desc-panel');
        const modalBody = document.getElementById('desc-modal-body');
        const data = screenDescriptions[screenId];
        
        if(!data) return;

        let featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

        const html = `
            <h3 class="desc-title">${data.title}</h3>
            <div class="desc-section">
                <h4>🎯 วัตถุประสงค์</h4>
                <p>${data.objective}</p>
            </div>
            <div class="desc-section">
                <h4>✨ ฟีเจอร์หลัก</h4>
                <ul>${featuresHtml}</ul>
            </div>
            <div class="desc-section">
                <h4>👆 วิธีใช้งาน (Interactive)</h4>
                <p>${data.usage}</p>
            </div>
        `;

        // อัปเดตทั้ง Desktop panel และ Modal body
        if(panel) panel.innerHTML = html;
        if(modalBody) modalBody.innerHTML = html;
    },

    showDescModal() {
        const overlay = document.getElementById('desc-modal-overlay');
        if(overlay) overlay.classList.add('show');
    },

    hideDescModal() {
        const overlay = document.getElementById('desc-modal-overlay');
        if(overlay) overlay.classList.remove('show');
    }
};

// เริ่มต้นการทำงานเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', () => app.init());