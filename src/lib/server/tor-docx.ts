/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx'

// ─── Types ───────────────────────────────────────────────────

type Fields = Record<string, unknown>

// ─── Small util helpers ──────────────────────────────────────

export async function createTorDocument(
  fields: Fields,
  _torType?: string
): Promise<Buffer> {
  const g = (k: string) => get(fields, k)

  // Extract fields
  const projectName = g('projectName')
  const background = g('background')
  const objective = g('objective')
  const budget = g('budget')
  const duration = g('duration')
  const warrantyYears = g('warrantyYears')
  const penaltyRate = g('penaltyRate')

  const children: Paragraph[] = [
    // ── Main Title ──
    thPara(
      [
        thText(
          'ร่างรายละเอียดขอบเขตของงานทั้งโครงการ (Terms of Reference : TOR)',
          { bold: true }
        ),
      ],
      { align: AlignmentType.LEFT, spaceAfter: 80 }
    ),

    // ── Section 1: ข้อมูลเกี่ยวกับโครงการ ──
    sectionHeading('๑', 'ข้อมูลเกี่ยวกับโครงการ'),

    // 1.1
    thPara(
      [
        thText('๑.๑ ชื่อโครงการ '),
        thText(val(projectName, 30), { bold: false, color: '800080' }),
      ],
      { left: 720, spaceAfter: 80 }
    ),

    // 1.2
    thPara([thText('๑.๒ ความเป็นมา ')], { left: 720, spaceAfter: 0 }),
    bodyPara(
      [thText(val(background, 30), { bold: false, color: '800080' })],
      0
    ),

    // 1.3
    thPara([thText('๑.๓ วัตถุประสงค์ ')], { left: 720, spaceAfter: 0 }),
    bodyPara([thText(val(objective, 30), { bold: false, color: '800080' })], 0),

    // 1.4
    thPara(
      [
        thText('๑.๔ วงเงินงบประมาณ/วงเงินที่ได้รับจัดสรร '),
        thText(val(budget, 30), { bold: false, color: '800080' }),
      ],
      { left: 720, spaceAfter: 80 }
    ),

    spacer(80),

    // ── Section 2: คุณสมบัติของผู้ยื่นข้อเสนอ ──
    sectionHeading('๒', 'คุณสมบัติของผู้ยื่นข้อเสนอ'),

    ...createQualifications(),

    spacer(80),

    // ── Section 3: รายละเอียดคุณลักษณะเฉพาะ ──
    sectionHeading(
      '๓',
      'รายละเอียดคุณลักษณะเฉพาะของพัสดุที่จะดำเนินการจัดซื้อ และเอกสารแนบท้ายอื่น ๆ'
    ),
    thPara([thText('เอกสารแนบ ๑ TOR DP๘-๔๖๓๔-WGZ')], {
      left: 720,
      spaceAfter: 80,
    }),

    spacer(80),

    // ── Section 4: กำหนดเวลาส่งมอบพัสดุ ──
    sectionHeading('๔', 'กำหนดเวลาส่งมอบพัสดุ'),
    thPara(
      [
        thText('ระยะเวลาส่งมอบ  '),
        thText(val(duration, 30), { bold: false, color: '800080' }),
      ],
      { left: 720, spaceAfter: 80 }
    ),

    spacer(80),

    // ── Section 5: งวดงานและการจ่ายเงิน ──
    sectionHeading('๕', 'งวดงานและการจ่ายเงิน'),
    bodyPara(
      [
        thText(
          'การไฟฟ้านครหลวง ฝ่ายวางแผนและบริหารทรัพย์สินดิจิทัล จะจ่ายค่าสิ่งของซึ่งได้รวมภาษีมูลค่าเพิ่ม ตลอดจนภาษีอากรอื่น ๆ และค่าใช้จ่ายทั้งปวงแล้วให้แก่ผู้ยื่นข้อเสนอที่ได้รับการคัดเลือกให้เป็นผู้ขาย เมื่อผู้ขายได้ส่งมอบสิ่งของได้ครบถ้วนตามสัญญาซื้อขายหรือข้อตกลงเป็นหนังสือ และการไฟฟ้านครหลวง ฝ่ายวางแผนและบริหารทรัพย์สินดิจิทัลได้ตรวจรับมอบสิ่งของไว้เรียบร้อยแล้ว'
        ),
      ],
      0
    ),

    spacer(80),

    // ── Section 6: หลักเกณฑ์ในการพิจารณา ──
    sectionHeading('๖', 'หลักเกณฑ์ในการพิจารณาคัดเลือกข้อเสนอ'),
    bodyPara(
      [
        thText(
          'ในการพิจารณาคัดเลือกผู้ชนะการยื่นข้อเสนอ การไฟฟ้านครหลวง ฝ่ายวางแผนและบริหารทรัพย์สินดิจิทัล จะพิจารณาตัดสินโดยใช้หลักเกณฑ์ราคา'
        ),
      ],
      0
    ),

    spacer(80),

    // ── Section 7: อัตราค่าปรับ ──
    sectionHeading('๗', 'อัตราค่าปรับ'),
    bodyPara(
      [
        thText('อัตราค่าปรับกำหนดให้คิดในอัตราร้อยละ '),
        thText(val(penaltyRate, 30), { bold: false, color: '800080' }),
      ],
      0
    ),

    spacer(80),

    // ── Section 8: การรับประกัน ──
    sectionHeading('๘', 'การกำหนดระยะเวลารับประกันความชำรุดบกพร่อง'),
    bodyPara(
      [
        thText(
          'ผู้ชนะการเสนอราคาจะต้องรับประกันความชำรุดบกพร่องของสิ่งของที่ซื้อเป็นเวลา '
        ),
        thText('๓', { bold: true }),
        thText(
          ' ปีนับถัดจากวันที่ผู้ซื้อ ได้รับมอบสิ่งของทั้งหมดไว้โดยถูกต้องครบถ้วนตามสัญญา โดยภายในกำหนดระยะเวลาดังกล่าวหากสิ่งของตามสัญญานี้เกิดชำรุดบกพร่องหรือขัดข้อง อันเนื่องมาจากการใช้งานตามปกติ ผู้ขายจะต้องจัดการซ่อมแซมหรือแก้ไขให้อยู่ในสภาพที่ใช้การได้ดีดังเดิมภายใน '
        ),
        thText('๒', { bold: true }),
        thText(
          ' วัน นับถัดจากวันที่ได้รับแจ้งจากผู้ซื้อ โดยไม่คิดค่าใช้จ่ายใดๆทั้งสิ้น'
        ),
      ],
      0
    ),

    spacer(80),
  ]

  const doc = new Document({
    sections: [
      {
        children,
        properties: {
          page: {
            margin: {
              bottom: 1134, // ~2 cm
              left: 1701, // ~3 cm
              right: 1134, // ~2 cm
              top: 1134, // ~2 cm
            },
          },
        },
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: 'TH Sarabun New',
            size: 28,
          },
        },
      },
    },
  })

  const buffer = await Packer.toBuffer(doc)
  return Buffer.from(buffer)
}

// ─── Helper Functions ────────────────────────────────────────

function bodyPara(runs: TextRun[], firstLine = 720): Paragraph {
  return thPara(runs, { firstLine, spaceAfter: 80 })
}

function createQualifications(): Paragraph[] {
  const paragraphs: Paragraph[] = []

  const items = [
    { num: '๒.๑', text: 'มีความสามารถตามกฎหมาย' },
    { num: '๒.๒', text: 'ไม่เป็นบุคคลล้มละลาย' },
    { num: '๒.๓', text: 'ไม่อยู่ระหว่างเลิกกิจการ' },
    {
      num: '๒.๔',
      text: 'ไม่เป็นบุคคลซึ่งอยู่ระหว่างถูกระงับการยื่นข้อเสนอหรือทำสัญญากับหน่วยงานของรัฐไว้ชั่วคราวตามที่ประกาศเผยแพร่ในระบบเครือข่ายสารสนเทศของกรมบัญชีกลาง',
    },
    {
      num: '๒.๕',
      text: 'ไม่เป็นบุคคลซึ่งถูกระบุชื่อไว้ในบัญชีรายชื่อผู้ทิ้งงานและได้แจ้งเวียนชื่อให้เป็นผู้ทิ้งงานของหน่วยงานของรัฐในระบบเครือข่ายสารสนเทศของกรมบัญชีกลาง ซึ่งรวมถึงนิติบุคคลที่ผู้ทิ้งงานเป็นหุ้นส่วนผู้จัดการ กรรมการผู้จัดการ ผู้บริหาร ผู้มีอำนาจในการดำเนินงานในกิจการของนิติบุคคลนั้นด้วย',
    },
    {
      num: '๒.๖',
      text: 'มีคุณสมบัติและไม่มีลักษณะต้องห้ามตามที่คณะกรรมการนโยบายการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐกำหนดในราชกิจจานุเบกษา',
    },
    {
      num: '๒.๗',
      text: 'เป็นบุคคลธรรมดาหรือนิติบุคคล ผู้มีอาชีพขายพัสดุที่ประกวดราคาอิเล็กทรอนิกส์ดังกล่าว',
    },
    {
      num: '๒.๘',
      text: 'ไม่เป็นผู้มีผลประโยชน์ร่วมกันกับผู้ยื่นข้อเสนอรายอื่นที่เข้ายื่นข้อเสนอให้แก่ การไฟฟ้านครหลวง ฝ่ายวางแผนและบริหารทรัพย์สินดิจิทัล ณ วันประกาศประกวดราคาอิเล็กทรอนิกส์หรือไม่เป็นผู้กระทำการอันเป็นการขัดขวางการแข่งขันราคาอย่างเป็นธรรม ในการเสนอราคาครั้งนี้',
    },
    {
      num: '๒.๙',
      text: 'ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย เว้นแต่รัฐบาลของผู้ยื่นข้อเสนอได้มีคำสั่งสละเอกสิทธิ์และความคุ้มกันเช่นว่านั้น',
    },
  ]

  // Add items 2.1-2.9
  items.forEach((item) => {
    paragraphs.push(
      thPara([thText(`${item.num}  `), thText(item.text)], {
        left: 720,
        spaceAfter: 80,
      })
    )
  })

  // Add 2.10 with sub-paragraphs
  paragraphs.push(
    thPara(
      [
        thText('๒.๑๐  '),
        thText(
          'ผู้ยื่นข้อเสนอที่ยื่นข้อเสนอในรูปแบบของ "กิจการร่วมค้า" ต้องมีคุณสมบัติดังนี้'
        ),
      ],
      { left: 720, spaceAfter: 40 }
    )
  )

  paragraphs.push(
    thPara(
      [
        thText(
          'กิจการร่วมค้าที่ยื่นข้อเสนอ ผู้เข้าร่วมค้าทุกรายจะต้องมีคุณสมบัติครบถ้วนตามเงื่อนไขที่กำหนดไว้ในเอกสารเชิญชวน เว้นแต่ในกรณีกิจการร่วมค้าที่มีข้อตกลงระหว่างผู้เข้าร่วมค้ากำหนดให้ผู้เข้าร่วมค้ารายใดรายหนึ่งเป็นผู้เข้าร่วมค้าหลัก กิจการร่วมค้านั้นสามารถใช้ผลงานของผู้เข้าร่วมค้าหลักรายเดียวเป็นก่อสร้างของกิจการร่วมค้าที่ยื่นข้อเสนอ'
        ),
      ],
      { left: 1080, spaceAfter: 80 }
    )
  )

  paragraphs.push(
    thPara(
      [
        thText(
          'กรณีมีข้อตกลงระหว่างผู้เข้าร่วมค้ากำหนดให้ผู้เข้าร่วมค้ารายใดรายหนึ่งเป็นผู้เข้าร่วมค้าหลัก ข้อตกลงดังกล่าวจะต้องมีการกำหนดสัดส่วนหน้าที่ และความรับผิดชอบในปริมาณงาน สิ่งของ หรือมูลค่าตามสัญญา มากกว่าผู้เข้าร่วมค้ารายอื่นทุกราย'
        ),
      ],
      { left: 1080, spaceAfter: 80 }
    )
  )

  paragraphs.push(
    thPara(
      [
        thText('๒.๑๑  '),
        thText(
          'ผู้ยื่นข้อเสนอต้องลงทะเบียนที่มีข้อมูลถูกต้องครบถ้วนในระบบจัดซื้อจัดจ้างภาครัฐด้วยอิเล็กทรอนิกส์ (Electronic Government Procurement : e-GP) ของกรมบัญชีกลาง'
        ),
      ],
      { left: 720, spaceAfter: 80 }
    )
  )

  paragraphs.push(
    thPara(
      [
        thText('๒.๑๒  '),
        thText('ผู้ยื่นข้อเสนอต้องมีมูลค่าสุทธิของกิจการ ดังนี้'),
      ],
      { left: 720, spaceAfter: 40 }
    )
  )

  // Add 2.12 sub-items
  const subItems = [
    '(๑) กรณีผู้ยื่นข้อเสนอเป็นนิติบุคคลที่จัดตั้งขึ้นตามกฎหมายไทยซึ่งได้จดทะเบียนเกินกว่า ๑ ปี ต้องมีมูลค่าสุทธิของกิจการ จากผลต่างระหว่างสินทรัพย์สุทธิหักด้วยหนี้สินสุทธิ ที่ปรากฏในงบแสดงฐานะการเงินที่มีการตรวจรับรองแล้ว ซึ่งจะต้องแสดงค่าเป็นบวกติดต่อกันเป็นระยะเวลา ๑ ปีสุดท้ายก่อนวันยื่นข้อเสนอ',
    '(๒) กรณีผู้ยื่นข้อเสนอเป็นนิติบุคคลที่จัดตั้งขึ้นตามกฎหมายไทย ซึ่งยังไม่มีการรายงานงบแสดงฐานะการเงินกับกรมพัฒนาธุรกิจการค้า ให้พิจารณาการกำหนดมูลค่าของทุนจดทะเบียน โดยผู้ยื่นข้อเสนอจะต้องมีทุนจดทะเบียนที่เรียกชำระมูลค่าหุ้นแล้ว ณ วันที่ยื่นข้อเสนอ ไม่ต่ำกว่า ๒ ล้านบาท',
    '(๓) กรณีผู้ยื่นข้อเสนอเป็นบุคคลธรรมดา ต้องมีมูลค่าสุทธิของกิจการ โดยพิจารณาจากบัญชีเงินฝากธนาคาร ณ วันยื่นข้อเสนอ โดยต้องมีเงินฝากเป็นบวกในมูลค่า ๑ ใน ๔ ของมูลค่างบประมาณที่ยื่นข้อเสนอในครั้งนั้น และหากเป็นผู้ชนะการจัดซื้อจัดจ้างหรือเป็นผู้ได้รับการคัดเลือกจะต้องแสดงบัญชีเงินฝากที่มีมูลค่าดังกล่าวอีกครั้งหนึ่งในวันลงนามในสัญญา',
    '(๔) กรณีที่ผู้ยื่นข้อเสนอไม่มีมูลค่าสุทธิของกิจการและทุนจดทะเบียน หรือมีแต่ไม่เพียงพอที่จะเข้ายื่นข้อเสนอ ผู้ยื่นข้อเสนอสามารถขอวงเงินสินเชื่อเพื่อมาสนับสนุนให้มูลค่าสุทธิ ของกิจการ (Net Worth) ไม่ติดลบ หรือให้มีสภาพคล่องที่ดีจนเพียงพอต่อการยื่นข้อเสนอ โดยต้องมีวงเงินสินเชื่อ ๑ ใน ๔ ของมูลค่างบประมาณที่ยื่นข้อเสนอในครั้งนั้น (สินเชื่อที่ธนาคารภายในประเทศ หรือบริษัทเงินทุนหรือบริษัทเงินทุนหลักทรัพย์ที่ได้รับอนุญาตให้ประกอบกิจการเงินทุนเพื่อการพาณิชย์ และประกอบธุรกิจ ค้าประกัน ตามประกาศของธนาคารแห่งประเทศไทย ตามรายชื่อบริษัทเงินทุนที่ธนาคารแห่งประเทศไทย แจ้งเวียนให้ทราบ โดยพิจารณาจากยอดเงินรวมของวงเงินสินเชื่อที่สำนักงานใหญ่รับรอง หรือที่สำนักงานสาขารับรอง (กรณีได้รับมอบอำนาจจากสำนักงานใหญ่) ซึ่งออกให้แก่ผู้ยื่นข้อเสนอ นับถึงวันยื่นข้อเสนอไม่เกิน ๙๐ วัน)',
    '(๕) กรณีตาม (๑) - (๔) ยกเว้นสำหรับกรณีดังต่อไปนี้',
    '(๕.๑) กรณีที่ผู้ยื่นข้อเสนอเป็นหน่วยงานของรัฐ',
    '(๕.๒) นิติบุคคลที่จัดตั้งขึ้นตามกฎหมายไทยที่อยู่ระหว่างการฟื้นฟูกิจการ ตามพระราชบัญญัติล้มละลาย (ฉบับที่ ๑๐) พ.ศ. ๒๕๖๑',
  ]

  subItems.forEach((item) => {
    paragraphs.push(
      thPara([thText(item)], {
        left: 1080,
        spaceAfter: 80,
      })
    )
  })

  return paragraphs
}

function get(fields: Fields, key: string): string {
  return (fields[key] as string | undefined) ?? ''
}

function sectionHeading(num: number | string, title: string): Paragraph {
  return thPara([thText(`${num}.  ${title}`, { bold: true })], {
    left: 720,
    spaceAfter: 80,
    spaceBefore: 80,
  })
}

function spacer(after = 160): Paragraph {
  return new Paragraph({ spacing: { after } })
}

// ─── Formatting Helpers ──────────────────────────────────────

function thPara(
  runs: TextRun[],
  opts?: {
    align?: (typeof AlignmentType)[keyof typeof AlignmentType]
    firstLine?: number
    left?: number
    spaceAfter?: number
    spaceBefore?: number
  }
): Paragraph {
  return new Paragraph({
    alignment: opts?.align ?? AlignmentType.LEFT,
    children: runs,
    indent:
      opts?.firstLine !== undefined || opts?.left !== undefined
        ? { firstLine: opts.firstLine, left: opts.left }
        : undefined,
    spacing: {
      after: opts?.spaceAfter ?? 80,
      before: opts?.spaceBefore ?? 0,
    },
  })
}

function thText(
  text: string,
  opts?: { bold?: boolean; color?: string; size?: number }
): TextRun {
  return new TextRun({
    bold: opts?.bold,
    color: opts?.color,
    font: 'TH Sarabun New',
    size: opts?.size ?? 28, // 14pt
    text,
  })
}

// ─── Utility Functions ───────────────────────────────────────

/** Return value string, or dotted placeholder when empty */
function val(v: unknown, dots = 20): string {
  const str = typeof v === 'string' ? v.trim() : String(v ?? '').trim()
  return str !== '' ? str : '.'.repeat(dots)
}
