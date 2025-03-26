import React from 'react'
import { pdf } from '@react-pdf/renderer'
import PdfDietEditor from 'diets/PdfDietEditor'
// if (true) {
//   const t: any = self
//   t.$RefreshReg$ = () => { }
//   t.$RefreshSig$ = () => () => { }
// }

async function getDietPdfBlob(data: any) {
  try {
    // const { default: PdfDietEditor } = await import('diets/PdfDietEditor')
    const document = (
      <PdfDietEditor
        dietForm={data.dietForm}
        foodsById={data.foodsById}
        portionsById={data.portionsById}
        subject={JSON.stringify(data.dietForm)}
        dietFormStatsTree={data.dietFormStatsTree}
      />
    )
    return await pdf(document).toBlob()

  } catch (err) {
    console.error(err)
  }

}

export { getDietPdfBlob }
