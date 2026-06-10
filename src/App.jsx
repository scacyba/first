import { useMemo, useState } from 'react';

const productMaster = {
  'PPバンド': {
    name: 'PPバンド',
    spec: '15.5mm × 2500m / 自動梱包機用（仮定）',
    unit: '本',
    unitPrice: 1850,
    minimumLot: 100,
    leadTime: '受注後 3〜5営業日'
  },
  'ストレッチフィルム': {
    name: 'ストレッチフィルム',
    spec: '500mm × 300m / 6巻入（仮定）',
    unit: '巻',
    unitPrice: 920,
    minimumLot: 24,
    leadTime: '受注後 5営業日'
  }
};

const areaMaster = {
  関東: { label: '関東', shippingFee: 18000, discountRate: 0.08, addressHint: '東京都・神奈川県・千葉県・埼玉県ほか' },
  関西: { label: '関西', shippingFee: 24000, discountRate: 0.06, addressHint: '大阪府・京都府・兵庫県ほか' },
  中部: { label: '中部', shippingFee: 21000, discountRate: 0.07, addressHint: '愛知県・静岡県・岐阜県ほか' },
  九州: { label: '九州', shippingFee: 32000, discountRate: 0.04, addressHint: '福岡県・熊本県・鹿児島県ほか' }
};

const samplePrompts = ['PPバンド5000本、関東向け', 'PPバンド 1200本 関西向け', 'ストレッチフィルム240巻、中部向け'];
const taxRate = 0.1;

const formatCurrency = (value) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
const formatNumber = (value) => new Intl.NumberFormat('ja-JP').format(value);

const getToday = () => new Date().toISOString().slice(0, 10);
const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

function parseRequest(text) {
  const normalized = text.replace(/[，、]/g, ',').replace(/向け/g, '').replace(/\s+/g, '');
  const product = Object.values(productMaster).find((item) => normalized.includes(item.name));
  const quantityMatch = normalized.match(/([0-9０-９,，]+)(本|巻|個|ケース)?/);
  const area = Object.values(areaMaster).find((item) => normalized.includes(item.label));

  const quantity = quantityMatch
    ? Number(quantityMatch[1].replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0)).replace(/,/g, ''))
    : 0;

  return {
    productKey: product?.name ?? 'PPバンド',
    quantity: quantity || 5000,
    areaKey: area?.label ?? '関東'
  };
}

function createQuote({ productKey, quantity, areaKey, customerName, issueDate }) {
  const safeIssueDate = issueDate || getToday();
  const product = productMaster[productKey];
  const area = areaMaster[areaKey];
  const roundedQuantity = Math.max(product.minimumLot, Math.ceil(quantity / product.minimumLot) * product.minimumLot);
  const subtotal = product.unitPrice * roundedQuantity;
  const volumeDiscount = roundedQuantity >= 1000 ? Math.round(subtotal * area.discountRate) : 0;
  const taxableAmount = subtotal - volumeDiscount + area.shippingFee;
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  return {
    quoteNo: `QT-${safeIssueDate.replaceAll('-', '')}-001`,
    issueDate: safeIssueDate,
    validUntil: addDays(safeIssueDate, 14),
    customerName,
    product,
    area,
    requestedQuantity: quantity,
    roundedQuantity,
    subtotal,
    volumeDiscount,
    taxableAmount,
    tax,
    total
  };
}

function App() {
  const [prompt, setPrompt] = useState('PPバンド5000本、関東向け');
  const [customerName, setCustomerName] = useState('サンプル商事株式会社');
  const [issueDate, setIssueDate] = useState(getToday());

  const parsed = useMemo(() => parseRequest(prompt), [prompt]);
  const quote = useMemo(
    () => createQuote({ ...parsed, customerName, issueDate }),
    [parsed, customerName, issueDate]
  );

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 print:bg-white print:p-0">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr] print:block print:max-w-none">
        <section className="rounded-3xl bg-white p-6 shadow-xl print:hidden">
          <p className="text-sm font-bold text-blue-700">自然文入力で見積書を自動作成</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">梱包資材 見積書作成システム</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            例：「PPバンド5000本、関東向け」と入力すると、仮定の製品マスタ・単価・地域別送料から一般的な見積書を生成します。
          </p>

          <label className="mt-6 block text-sm font-bold" htmlFor="prompt">
            依頼内容
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="PPバンド5000本、関東向け"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {samplePrompts.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setPrompt(sample)}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100"
              >
                {sample}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block text-sm font-bold" htmlFor="customerName">
              宛先
              <input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block text-sm font-bold" htmlFor="issueDate">
              発行日
              <input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm">
            <h2 className="font-bold">解析結果</h2>
            <dl className="mt-3 grid grid-cols-2 gap-2">
              <dt className="text-slate-500">製品</dt>
              <dd className="font-bold">{quote.product.name}</dd>
              <dt className="text-slate-500">数量</dt>
              <dd className="font-bold">{formatNumber(quote.requestedQuantity)}{quote.product.unit}</dd>
              <dt className="text-slate-500">地域</dt>
              <dd className="font-bold">{quote.area.label}</dd>
              <dt className="text-slate-500">合計</dt>
              <dd className="font-bold text-blue-700">{formatCurrency(quote.total)}</dd>
            </dl>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="mt-6 w-full rounded-2xl bg-blue-700 px-5 py-3 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-800"
          >
            見積書を印刷 / PDF保存
          </button>
        </section>

        <section className="quote-sheet bg-white p-8 shadow-xl print:shadow-none">
          <header className="border-b-4 border-slate-900 pb-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm font-bold tracking-[0.3em] text-slate-500">QUOTATION</p>
                <h2 className="mt-2 text-4xl font-black">御見積書</h2>
              </div>
              <dl className="grid grid-cols-[90px_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="font-bold text-slate-500">見積番号</dt>
                <dd>{quote.quoteNo}</dd>
                <dt className="font-bold text-slate-500">発行日</dt>
                <dd>{quote.issueDate}</dd>
                <dt className="font-bold text-slate-500">有効期限</dt>
                <dd>{quote.validUntil}</dd>
              </dl>
            </div>
          </header>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="border-b border-slate-300 pb-2 text-2xl font-bold">{quote.customerName} 御中</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                下記の通り御見積申し上げます。ご検討のほどよろしくお願いいたします。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-300 p-4 text-sm leading-6">
              <p className="text-lg font-black">株式会社サンプルパッケージ</p>
              <p>〒100-0001 東京都千代田区サンプル1-2-3</p>
              <p>TEL: 03-0000-0000 / Mail: quote@example.com</p>
              <p>担当: 営業部 見積 太郎</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-sm font-bold text-slate-300">御見積金額（税込）</p>
            <p className="mt-1 text-4xl font-black">{formatCurrency(quote.total)}</p>
          </div>

          <table className="mt-8 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-3 py-3 text-left">品名</th>
                <th className="border border-slate-300 px-3 py-3 text-left">仕様</th>
                <th className="border border-slate-300 px-3 py-3 text-right">数量</th>
                <th className="border border-slate-300 px-3 py-3 text-right">単価</th>
                <th className="border border-slate-300 px-3 py-3 text-right">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-3 py-3 font-bold">{quote.product.name}</td>
                <td className="border border-slate-300 px-3 py-3">{quote.product.spec}</td>
                <td className="border border-slate-300 px-3 py-3 text-right">
                  {formatNumber(quote.roundedQuantity)} {quote.product.unit}
                </td>
                <td className="border border-slate-300 px-3 py-3 text-right">{formatCurrency(quote.product.unitPrice)}</td>
                <td className="border border-slate-300 px-3 py-3 text-right">{formatCurrency(quote.subtotal)}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-3 font-bold">地域別配送費</td>
                <td className="border border-slate-300 px-3 py-3">{quote.area.label}向け（{quote.area.addressHint}）</td>
                <td className="border border-slate-300 px-3 py-3 text-right">1 式</td>
                <td className="border border-slate-300 px-3 py-3 text-right">{formatCurrency(quote.area.shippingFee)}</td>
                <td className="border border-slate-300 px-3 py-3 text-right">{formatCurrency(quote.area.shippingFee)}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-3 font-bold">大口値引</td>
                <td className="border border-slate-300 px-3 py-3">{quote.area.label}エリア想定値引率 {quote.area.discountRate * 100}%</td>
                <td className="border border-slate-300 px-3 py-3 text-right">1 式</td>
                <td className="border border-slate-300 px-3 py-3 text-right">-</td>
                <td className="border border-slate-300 px-3 py-3 text-right">-{formatCurrency(quote.volumeDiscount)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <dl className="w-full max-w-sm text-sm">
              <div className="flex justify-between border-b border-slate-300 py-2">
                <dt>小計</dt>
                <dd>{formatCurrency(quote.subtotal + quote.area.shippingFee - quote.volumeDiscount)}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-300 py-2">
                <dt>消費税（10%）</dt>
                <dd>{formatCurrency(quote.tax)}</dd>
              </div>
              <div className="flex justify-between bg-slate-900 px-3 py-3 text-lg font-black text-white">
                <dt>合計</dt>
                <dd>{formatCurrency(quote.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-slate-300 p-4">
              <h3 className="font-black">取引条件</h3>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>納期: {quote.product.leadTime}</li>
                <li>支払条件: 月末締め翌月末払い（仮定）</li>
                <li>納入場所: {quote.area.label}エリア指定倉庫</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-300 p-4">
              <h3 className="font-black">備考</h3>
              <p className="mt-2 text-slate-700">
                製品マスタ、単価、送料、値引率はデモ用の仮定値です。正式見積では在庫・配送条件・原材料市況により変動します。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
