import { AlignmentType, Document, Packer, Paragraph, TextRun } from 'docx'

// ─── Types ───────────────────────────────────────────────────

type Fields = Record<string, unknown>

// ─── Small util helpers ──────────────────────────────────────

export async function createTorDocument(
  fields: Fields,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _torType?: string
): Promise<Buffer> {
  const g = (k: string) => get(fields, k)
  const ga = (k: string) => getArray(fields, k)

  const background = g('background')
  const bondPercent = g('bondPercent')
  const budget = g('budget')
  const conditions = g('conditions')
  const duration = g('duration')
  const middlePrice = g('middlePrice')
  const objectives = g('objectives')
  const penaltyMin = g('penaltyMin')
  const penaltyRate = g('penaltyRate')
  const projectName = g('projectName')
  const quantity = g('quantity')
  const unit = g('unit')
  const warrantyYears = g('warrantyYears')

  const projectLine =
    [projectName, quantity, unit].filter(Boolean).join(' ') || ''

  const children: Paragraph[] = [
    // ── Main Title ──
    thPara(
      [
        thText('ขอบเขตของงาน Terms of Reference : TOR  (จัดซื้อคอมพิวเตอร์)', {
          bold: true,
        }),
      ],
      { align: AlignmentType.CENTER }
    ),

    // ── Project line ──
    thPara([thText('โครงการ'), thText(val(projectLine, 30), { bold: true })], {
      align: AlignmentType.CENTER,
    }),

    // ── Separator ──
    thPara(
      [
        thText(
          '-----------------------------------------------------------------------'
        ),
      ],
      { align: AlignmentType.CENTER }
    ),

    spacer(80),

    // ── 1. Background ──
    sectionHeading('๑', 'ความเป็นมา'),
    bodyPara([thText(val(background, 60))]),
    spacer(80),

    // ── 2. Objectives ──
    sectionHeading('๒', 'วัตถุประสงค์'),
    bodyPara([thText(val(objectives, 60))]),
    // ...(objectives.length > 0
    //   ? objectives.map((obj) => bodyPara([thText(val(obj, 50))]))
    //   : [
    //       bodyPara([
    //         thText(
    //           '...............................................................................'
    //         ),
    //       ]),
    //     ]),
    spacer(80),

    // ── 3. Qualifications ──
    sectionHeading('๓', 'คุณสมบัติของผู้เสนอราคา'),
    ...createQualifications(fields),
    spacer(80),

    // ── 4. Specifications ──
    sectionHeading('๔', 'คุณลักษณะเฉพาะ'),
    thPara(
      [
        thText(
          'กำหนดรายละเอียดคุณลักษณะของพัสดุที่ต้องการซื้อ เพื่อให้เป็นไปตามความต้องการใช้งานของผู้ซื้อ'
        ),
      ],
      { left: 720, spaceAfter: 80 }
    ),
    subHeading('4.1', 'คุณสมบัติทั่วไป'),
    subHeading('4.2', 'คุณสมบัติด้านเทคนิค'),
    ...createSpecParagraphs(fields),
    spacer(80),

    // ── 5. General Conditions ──
    sectionHeading('๕', 'ข้อกำหนดทั่วไป'),
    thPara(
      [
        thText(
          '5.1  ผู้ขายจะต้องแจ้งกำหนดเวลาติดตั้งแล้วเสร็จพร้อมที่จะใช้งานและส่งมอบคอมพิวเตอร์ได้โดยทำเป็นหนังสือยื่นต่อผู้ซื้อ ณ '
        ),
        thText(val('', 15)),
        thText('ในเวลาราชการก่อนวันกำหนดส่งมอบไม่น้อยกว่า'),
        thText(val(duration, 5), { bold: true }),
        thText('วันทำการ'),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    thPara(
      [
        thText(
          '5.2  ผู้ขายต้องออกแบบสถานที่ติดตั้งคอมพิวเตอร์รวมทั้งระบบอื่น ๆ ที่เกี่ยวข้องตามมาตรฐานของผู้ขาย'
        ),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    thPara(
      [
        thText(
          '5.3  ผู้ขายต้องนำเสนอแผนการฝึกอบรมในรายละเอียด เช่น หัวข้อการฝึกอบรม ระยะเวลา คุณสมบัติผู้เข้ารับการอบรม วิทยากร'
        ),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    thPara([thText('5.4  '), thText(val(conditions, 40))], {
      left: 360,
      spaceAfter: 80,
    }),
    spacer(80),

    // ── 6. Duration ──
    sectionHeading('๖', 'ระยะเวลาดำเนินการ'),
    thPara(
      [
        thText(
          '6.1  ผู้ขายจะต้องติดตั้งคอมพิวเตอร์ที่ขาย ให้ถูกต้องและครบถ้วนตาม ข้อกำหนด และพร้อมที่จะใช้งานได้ให้แก่สำนักงานภายใน'
        ),
        thText(val(duration, 10), { bold: true }),
        thText('วันนับถัดจากวันลงนามในสัญญา'),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    thPara(
      [
        thText(
          '6.2  ผู้ขายจะต้องจัดฝึกอบรมให้แก่เจ้าหน้าที่ของสำนักงาน จำนวนไม่น้อยกว่า'
        ),
        thText(val('', 6), { bold: true }),
        thText('คน จำนวนไม่น้อยกว่า'),
        thText(val('', 6), { bold: true }),
        thText('วัน ให้แล้วเสร็จภายใน'),
        thText(val('', 10), { bold: true }),
        thText('วันนับถัดจากวันลงนามในสัญญา'),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    spacer(80),

    // ── 7. Delivery Date ──
    sectionHeading('๗', 'กำหนดส่งมอบ'),
    bodyPara([
      thText(
        'ผู้ขายจะต้องส่งมอบพัสดุทั้งหมดพร้อมติดตั้งและฝึกอบรม (ถ้ามี) ภายในระยะเวลา'
      ),
      thText(val(duration, 10), { bold: true }),
      thText('วันนับถัดจากวันลงนามในสัญญาซื้อขาย'),
    ]),
    spacer(80),

    // ── 8. Delivery Location ──
    sectionHeading('๘', 'สถานที่ส่งมอบ'),
    bodyPara([thText(val('', 50))]),
    spacer(80),

    // ── 9. Budget ──
    sectionHeading('๙', 'วงเงินในการจัดซื้อ'),
    thPara(
      [
        thText('งบประมาณในการจัดซื้อ'),
        thText(val(budget, 20), { bold: true }),
        thText('จำนวนเงิน'),
        thText(val(budget, 15), { bold: true }),
        thText('บาท'),
      ],
      { left: 720, spaceAfter: 40 }
    ),
    thPara([thText('(' + val('', 30) + ')')], { left: 720, spaceAfter: 40 }),
    thPara(
      [
        thText('ราคากลางในการจัดซื้อ'),
        thText(val(middlePrice, 20), { bold: true }),
        thText('จำนวนเงิน'),
        thText(val(middlePrice, 15), { bold: true }),
        thText('บาท'),
      ],
      { left: 720, spaceAfter: 40 }
    ),
    thPara([thText('(' + val('', 28) + ')รวมภาษีมูลค่าเพิ่ม')], {
      left: 720,
      spaceAfter: 80,
    }),
    spacer(80),

    // ── 10. Warranty ──
    sectionHeading('๑๐', 'การรับประกันความชำรุดบกพร่องของพัสดุที่ส่งมอบ'),
    bodyPara([
      thText(
        '1. ผู้ขายต้องรับประกันความชำรุดบกพร่องของการติดตั้งและคอมพิวเตอร์ตามสัญญานี้เป็นเวลา'
      ),
      thText(val(warrantyYears, 5), { bold: true }),
      thText('ปี'),
      thText(val('', 5), { bold: true }),
      thText(
        'เดือน นับแต่วันที่ผู้ซื้อได้รับมอบ ถ้าภายในระยะเวลาดังกล่าวการติดตั้งหรือคอมพิวเตอร์ชำรุดบกพร่องหรือใช้งานไม่ได้ทั้งหมดหรืองแต่บางส่วน'
      ),
    ]),
    bodyPara([
      thText(
        '2. ผู้ขายมีหน้าที่บำรุงรักษาและซ่อมแซมแก้ไขคอมพิวเตอร์ให้อยู่ในสภาพใช้งานได้ดีตลอดระยะเวลาที่รับประกัน ด้วยค่าใช้จ่ายของผู้ขาย'
      ),
    ]),
    spacer(80),

    // ── 11. Payment Terms ──
    sectionHeading('๑๑', 'เงื่อนไขการชำระเงิน'),
    thPara(
      [
        thText(
          'สำนักงานจะ\t\tชำระเงิน ค่าสิ่งของให้แก่ผู้ขาย เมื่อ สำนักงานได้รับมอบสิ่งของโดยครบถ้วนแล้ว  (กรณีชำระครั้งเดียว)'
        ),
      ],
      { left: 360, spaceAfter: 80 }
    ),
    thPara(
      [thText('สำนักงานจะชำระเงินค่าสิ่งของ ให้แก่ผู้ขาย เป็นงวด ๆ ดังนี้')],
      { left: 720, spaceAfter: 40 }
    ),
    thPara(
      [
        thText('งวดที่ 1 เป็นจำนวน  ร้อยละ'),
        thText(val('', 8), { bold: true }),
        thText('ของมูลค่าตามสัญญา เมื่อ\t\tผู้ขาย ได้ ส่งมอบพัสดุ'),
        thText(val('', 10), { bold: true }),
        thText('ภายใน '),
        thText(val('', 10), { bold: true }),
        thText('วัน และคณะกรรมการตรวจรับพัสดุ ได้ตรวจรับเรียบร้อยแล้ว'),
      ],
      { left: 720, spaceAfter: 40 }
    ),
    thPara(
      [
        thText('งวดที่ 2 เป็นจำนวน  ร้อยละ'),
        thText(val('', 8), { bold: true }),
        thText('ของมูลค่าตามสัญญา เมื่อ\t\tผู้ขาย ได้ ส่งมอบพัสดุ'),
        thText(val('', 10), { bold: true }),
        thText('ภายใน '),
        thText(val('', 10), { bold: true }),
        thText('วัน และคณะกรรมการตรวจรับพัสดุ ได้ตรวจรับเรียบร้อยแล้ว'),
      ],
      { left: 720, spaceAfter: 80 }
    ),
    spacer(80),

    // ── 12. Advance Payment ──
    sectionHeading('๑๒', 'การจ่ายเงินล่วงหน้า (ถ้ามี)'),
    bodyPara([
      thText(
        'สำนักงานจะ\t\tจ่ายเงิน สิ่งของล่วงหน้าให้แก่ ผู้ขาย จำนวน ร้อยละ...(ไม่เกิน...15)...........ของราคาค่าสิ่งของ ตามสัญญา'
      ),
    ]),
    spacer(80),

    // ── 13. Penalty ──
    sectionHeading('๑๓', 'ค่าปรับ'),
    bodyPara([
      thText(
        'หากผู้ขายไม่สามารถส่งมอบสิ่งของภายในเวลาที่กำหนดไว้ในสัญญา ผู้ขายจะต้องชำระค่าปรับให้แก่ ผู้ซื้อเป็นรายวันอัตราร้อยละ '
      ),
      thText(val(penaltyRate, 6), { bold: true }),
      thText(
        ' (ศูนย์จุดสองศูนย์) ของมูลค่าค่าสิ่งของตามสัญญา แต่ไม่ต่ำกว่าวันละ '
      ),
      thText(val(penaltyMin, 6), { bold: true }),
      thText(' บาท'),
    ]),
    spacer(80),

    // ── 14. Performance Bond ──
    sectionHeading(14, 'หลักประกันสัญญา'),
    bodyPara([
      thText('ผู้ขายจะต้องนำหลักประกันอัตรา\t\t'),
      thText('ร้อยละ '),
      thText(val(bondPercent, 5), { bold: true }),
      thText(
        ' ของราคาค่าสิ่งของตามสัญญา มามอบไว้แก่สำนักงาน เพื่อเป็นหลักประกันการปฏิบัติตามสัญญา'
      ),
    ]),
    spacer(80),

    // ── 15. Bid Submission ──
    sectionHeading(15, 'การยื่นข้อเสนอ'),
    bodyPara([thText('ผู้เสนอราคาจะต้องยื่นข้อเสนอดังนี้')]),
    spacer(80),

    // ── 16. Evaluation Criteria ──
    sectionHeading(16, 'หลักเกณฑ์และสิทธิในการพิจารณาข้อเสนอ'),
    bodyPara([
      thText(
        'ในการพิจารณาผลการยื่นข้อเสนอราคาอิเล็กทรอนิกส์ครั้งนี้ สำนักงานฯ จะพิจารณาตัดสิน'
      ),
    ]),
    thPara([thText('โดยใช้เกณฑ์ราคา  (ใช้ราคาต่ำสุด)หรือ', { bold: true })], {
      left: 720,
      spaceBefore: 40,
    }),
    thPara(
      [
        thText(
          'หลักเกณฑ์การประเมินค่าประสิทธิภาพต่อราคา  โดยพิจารณาให้คะแนนราคา ..........คะแนน และเกณฑ์คุณภาพ'
        ),
        thText(val('', 10)),
        thText('คะแนน รวม 100 คะแนน ดังนี้'),
      ],
      { left: 720, spaceAfter: 40 }
    ),
    thPara([thText('ต้นทุนของพัสดุนั้นตลอดอายุการใช้สอย\t\tคะแนน')], {
      left: 720,
      spaceAfter: 20,
    }),
    thPara([thText('มาตรฐานของสินค้าหรือบริการ\t\tคะแนน')], {
      left: 720,
      spaceAfter: 20,
    }),
    thPara([thText('บริการหลังการขาย\t\tคะแนน')], {
      left: 720,
      spaceAfter: 20,
    }),
    thPara(
      [thText('พัสดุที่รัฐต้องการส่งเสริมหรือสนับสนุน (ถ้ามี)\t\tคะแนน')],
      { left: 720, spaceAfter: 20 }
    ),
    thPara([thText('ข้อเสนอด้านเทคนิคหรือข้อเสนออื่น ๆ\t\tคะแนน')], {
      left: 720,
      spaceAfter: 80,
    }),
  ]

  const doc = new Document({
    sections: [
      {
        children,
        properties: {
          page: {
            margin: {
              bottom: 1134, // ~2 cm
              left: 1701, //  ~3 cm
              right: 1134, // ~2 cm
              top: 1134, //  ~2 cm
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

function bodyPara(runs: TextRun[], firstLine = 720): Paragraph {
  return thPara(runs, { firstLine, spaceAfter: 80 })
}

function createQualifications(fields: Fields): Paragraph[] {
  const brands = get(fields, 'brands')
  const minProjectValue = get(fields, 'minProjectValue')

  const items: Array<{ num: string; text: string }> = [
    {
      num: '3.1',
      text: 'เป็นนิติบุคคลผู้มีอาชีพขายพัสดุที่จัดซื้อครั้งนี้',
    },
    {
      num: '3.2',
      text: 'ไม่เป็นผู้ที่ถูกระบุชื่อไว้ในบัญชีรายชื่อผู้ทิ้งงานของทางราชการ และได้แจ้งเวียนชื่อแล้วหรือไม่เป็นผู้ที่ได้รับผลของการสั่งให้นิติบุคคลหรือบุคคลอื่นเป็นผู้ทิ้งงานตามระเบียบของทางราชการ',
    },
    {
      num: '3.3',
      text: 'ไม่เป็นผู้ได้รับเอกสิทธิ์หรือความคุ้มกัน ซึ่งอาจปฏิเสธไม่ยอมขึ้นศาลไทย เว้นแต่รัฐบาลของผู้เสนอราคา ได้มีคำสั่งให้สละสิทธิ์ความคุ้มกันเช่นว่านั้น',
    },
    {
      num: '3.4',
      text: 'ไม่เป็นผู้มีผลประโยชน์ร่วมกันกับผู้เสนอราคารายอื่นที่เข้าเสนอราคาให้แก่สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน)',
    },
    {
      num: '3.8',
      text: `ผู้เสนอราคาต้องเป็นผู้ผลิต หรือผู้แทนจำหน่ายที่เสนอ จากบริษัทผู้ผลิต${val(brands, 20)}โดยตรง/ผู้แทนจำหน่าย`,
    },
    {
      num: '3.9',
      text: `ผู้เสนอราคาต้องมีผลงาน การจำนวนพัสดุประเภทเดียวกันกับที่จัดซื้อ ในวงเงินไม่น้อยกว่า ${val(minProjectValue, 10)} (ไม่เกิน 50% ของงบประมาณการจัดซื้อ)`,
    },
  ]

  return items.map((item) =>
    thPara([thText(`${item.num}  `), thText(item.text)], {
      left: 360,
      spaceAfter: 80,
    })
  )
}

function createSpecParagraphs(fields: Fields): Paragraph[] {
  const specs = [
    { label: '• ประมวลผล (CPU)\t\t: ', value: get(fields, 'cpu') },
    { label: '• หน่วยความจำ (RAM)\t: ', value: get(fields, 'ram') },
    { label: '• พื้นที่จัดเก็บ (Storage)\t: ', value: get(fields, 'storage') },
    { label: '• ระบบปฏิบัติการ (OS)\t: ', value: get(fields, 'os') },
    { label: '• มอนิเตอร์\t\t\t: ', value: get(fields, 'monitor') },
    {
      label: '• การรับประกัน\t\t: ',
      value: get(fields, 'warrantyYears')
        ? get(fields, 'warrantyYears') + ' ปี'
        : '',
    },
  ]

  return specs.map(({ label, value }) =>
    thPara([thText(label), thText(val(value, 25), { bold: !!value })], {
      left: 720,
      spaceAfter: 60,
    })
  )
}

function get(fields: Fields, key: string): string {
  return (fields[key] as string | undefined) ?? ''
}

function getArray(fields: Fields, key: string): string[] {
  return (fields[key] as string[] | undefined) ?? []
}

function sectionHeading(num: number | string, title: string): Paragraph {
  return thPara([thText(`${num}.  ${title}`, { bold: true })], {
    spaceAfter: 80,
    spaceBefore: 200,
  })
}

function spacer(after = 160): Paragraph {
  return new Paragraph({ spacing: { after } })
}

function subHeading(num: string, title: string): Paragraph {
  return thPara([thText(`${num}  ${title}`, { bold: true })], {
    left: 360,
    spaceAfter: 80,
    spaceBefore: 80,
  })
}

// ─── Section helpers ─────────────────────────────────────────

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
    alignment: opts?.align ?? AlignmentType.JUSTIFIED,
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

// ─── Main document builder ───────────────────────────────────

/** Return value string, or dotted placeholder when empty */
function val(v: unknown, dots = 20): string {
  const str = typeof v === 'string' ? v.trim() : String(v ?? '').trim()
  return str !== '' ? str : '.'.repeat(dots)
}
