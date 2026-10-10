const screenDescriptions = {
    'screen-welcome': {
        title: "1. Welcome & LINE Rich Menu",
        objective: "หน้าต้อนรับเมื่อผู้ใช้แอด LINE Bot และแสดงช่องทางหลักในการเข้าถึงฟีเจอร์",
        features: ["ข้อความทักทายอัตโนมัติจาก Bot", "Rich Menu ที่แบ่งพื้นที่กดชัดเจน เพื่อเข้าถึง 3 ฟีเจอร์หลัก"],
        usage: "ผู้ใช้สามารถคลิกเมนูบน Rich Menu ด้านล่าง เพื่อทดลองเปลี่ยนหน้าจอไปยังฟีเจอร์ต่างๆ ได้"
    },
    'screen-location': {
        title: "2. Location Request (ขอตำแหน่ง)",
        objective: "ขอรับพิกัดปัจจุบันของผู้ใช้เพื่อนำไปคำนวณระยะทางหาห้องน้ำที่ใกล้ที่สุด",
        features: ["ปุ่ม Quick Reply ขอพิกัดที่ติดมากับข้อความ Bot"],
        usage: "จำลองการกดปุ่ม 'แชร์ตำแหน่งที่ตั้ง' เพื่อดูผลลัพธ์การค้นหา"
    },
    'screen-results': {
        title: "3. Search Results (Flex Message)",
        objective: "แสดงห้องน้ำที่ใกล้ที่สุด 3 อันดับแรก",
        features: ["แสดงผลแบบ Carousel เลื่อนซ้ายขวาได้", "บอกรายละเอียด: ชื่อตึก, ชั้น, ระยะทาง, สถานะปัจจุบัน", "แสดงไอคอนสิ่งอำนวยความสะดวก เช่น สายฉีดชำระ"],
        usage: "สามารถเลื่อนดูการ์ดห้องน้ำ และคลิกปุ่ม 'นำทางไปที่นี่' ได้"
    },
    'screen-filter': {
        title: "4. Filter Search (LIFF App)",
        objective: "ระบบตัวกรองสิ่งอำนวยความสะดวกเฉพาะ",
        features: ["เปิดขึ้นมาเป็นหน้า Web App ภายใน LINE (LIFF)", "สามารถติ๊กเลือกตัวกรองได้มากกว่า 1 ตัวเลือก เช่น มีสายฉีดชำระ, แยกเพศ"],
        usage: "ทดลองคลิกเลือก Checkbox และกดปุ่มค้นหา"
    },
    'screen-report': {
        title: "5. Report & Review (LIFF App)",
        objective: "ระบบรายงานสถานะและให้คะแนนความสะอาด เพื่อเป็นข้อมูล Crowdsourcing",
        features: ["เลือกแจ้งสถานะ: ปกติ, ทำความสะอาด, หรือ ชำรุด (Out of Service)", "ให้คะแนนดาว 1-5 ดาว", "พิมพ์ข้อความรีวิว"],
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
        this.navigate('screen-welcome');
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
    navigate(screenId) {
        // ซ่อนทุกหน้าจอ แล้วแสดงเฉพาะหน้าที่ถูกเลือก
        document.querySelectorAll('.screen-view').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(screenId);
        if(targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }

        // จัดการ Header LINE (ถ้าเป็น LIFF เปลี่ยนเป็นสีขาว)
        const header = document.getElementById('dynamic-header');
        const closeBtn = document.getElementById('liff-close-btn');
        if(targetScreen.classList.contains('liff-view')) {
            header.style.backgroundColor = '#FFFFFF';
            header.style.color = '#333333';
            closeBtn.style.display = 'inline-block';
            closeBtn.onclick = () => this.navigate('screen-welcome');
        } else {
            header.style.backgroundColor = '#1E459F';
            header.style.color = '#FFFFFF';
            closeBtn.style.display = 'none';
        }

        // ทำให้ปุ่มเมนูด้านบนเป็น Active
        document.querySelectorAll('#nav-menu button').forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-target') === screenId) btn.classList.add('active');
        });

        // อัปเดตข้อมูลใส่กล่องคำอธิบายด้านล่างโทรศัพท์แบบฝัง HTML
        this.updateDescription(screenId);
    },
    updateDescription(screenId) {
        const panel = document.getElementById('desc-panel');
        const data = screenDescriptions[screenId];
        if(!data) return;
        
        let featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');
        panel.innerHTML = `
            <h3 class="desc-title">${data.title}</h3>
            <div class="desc-section"><h4>🎯 วัตถุประสงค์</h4><p>${data.objective}</p></div>
            <div class="desc-section"><h4>✨ ฟีเจอร์หลัก</h4><ul>${featuresHtml}</ul></div>
            <div class="desc-section"><h4>👆 วิธีใช้งาน (Interactive)</h4><p>${data.usage}</p></div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());