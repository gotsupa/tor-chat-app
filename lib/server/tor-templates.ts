/**
 * TOR template data — migrated from Python main.py TOR_TEMPLATES.
 */
export const TOR_TEMPLATES: Record<
  string,
  {
    category: string
    fields: Record<string, unknown>
    title: string
  }
> = {
  computer: {
    category: 'จัดซื้อ',
    fields: {
      background:
        'อุปกรณ์เดิมของหน่วยงานบริหารจัดการมีอายุการใช้งานเกิน 5 ปี ประสิทธิภาพลดลง',
      bond_percent: '5',
      brands: 'Dell, HP, Lenovo, ASUS',
      budget: '1,000,000',
      cpu: 'Intel Core i7 (ชั่วที่ 12 ขึ้นไป) หรือ AMD Ryzen 7',
      delivery_location: 'หน่วยงานบริหารจัดการ สำนักที่ 2 ชั้น 3',
      design_days: '3',
      downtime_hours: '8',
      downtime_percent: '5',
      evaluation_method: 'ราคาต่ำสุด',
      installation_days: '30',
      middle_price: '920,000',
      min_project_value: '500,000',
      monitor: '24 นิ้ว Full HD (1920x1080)',
      notify_days: '5',
      objectives: [
        'เพื่อจัดหาคอมพิวเตอร์ส่วนบุคคลมาตรฐานที่มีประสิทธิภาพสูง',
        'เพื่อให้มีอุปกรณ์คอมพิวเตอร์ที่เพียงพอสำหรับพนักงาน',
        'เพื่อปรับปรุงประสิทธิภาพการทำงาน',
      ],
      os: 'Windows 10 Pro / Windows 11 Pro',
      penalty_min: '100',
      penalty_rate: '0.20',
      project_name: 'จัดซื้อคอมพิวเตอร์ส่วนบุคคล (Desktop PC) จำนวน',
      quantity: '10',
      ram: '16 GB DDR4',
      repair_days: '3',
      storage: '512 GB SSD',
      submission_date: '15 มกราคม 2567 เวลา 16:30 น.',
      training_days: '3',
      training_people: '10',
      unit: 'เครื่อง',
      warranty_years: '1',
    },
    title: 'จัดซื้อคอมพิวเตอร์',
  },
  construction: {
    category: 'จ้าง',
    fields: {
      location: 'ที่ตั้งโครงการ',
      objectives: ['เพื่อจ้างก่อสร้าง', 'เพื่อพัฒนาโครงสร้างพื้นฐาน'],
      project_name: 'โครงการก่อสร้าง',
      work_type: 'ก่อสร้าง',
    },
    title: 'จ้างก่อสร้าง',
  },
  equipment: {
    category: 'จัดซื้อ',
    fields: {
      background: 'เพื่อเพิ่มประสิทธิภาพการทำงาน',
      objectives: ['เพื่อจัดหาอุปกรณ์สำนักงาน', 'เพื่อสนับสนุนการปฏิบัติงาน'],
      project_name: 'จัดซื้ออุปกรณ์สำนักงาน',
      quantity: '',
      unit: 'ชุด',
    },
    title: 'จัดซื้ออุปกรณ์สำนักงาน',
  },
  vehicle: {
    category: 'จัดซื้อ',
    fields: {
      background: 'เพื่อใช้ในการบริหารจัดการหน่วยงาน',
      objectives: ['เพื่อจัดหายานพาหนะ', 'เพื่อสนับสนุนการทำงาน'],
      project_name: 'จัดซื้อยานพาหนะ',
      quantity: '',
      unit: 'คัน',
    },
    title: 'จัดซื้อยานพาหนะ',
  },
}
