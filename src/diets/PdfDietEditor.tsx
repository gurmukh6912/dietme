import ReactPDF, {
  Document,
  Page,
  Font,
  StyleSheet,
  View,
} from '@react-pdf/renderer'
import { Food } from 'foods'
import { Portion } from 'portions'
import { ReactElement } from 'react'
import { StatsTree } from 'stats/calculations/getStatsTree'
import getComputedColorFromChakra from 'theme/getComputedColorFromChakra'
import PdfVariantItem from 'variants/PdfVariantsList/PdfVariantItem'
import { DietForm } from './dietForm'

type Props = {
  dietForm: DietForm
  foodsById: Record<number, Food>
  portionsById: Record<string, Portion>

  dietFormStatsTree: StatsTree
} & ReactPDF.DocumentProps

function PdfDietEditor({
  dietForm,
  foodsById,
  portionsById,
  dietFormStatsTree,
  ...rest
}: Props) {
  const { variantsForms } = dietForm

  const variantItemsElements: ReactElement[] = []

  variantsForms.forEach((variantForm, index) => {
    const { mealsForms } = variantForm
    const { stats, subtrees } = dietFormStatsTree.subtrees[index]

    if (mealsForms.length > 0) {
      variantItemsElements.push(
        <PdfVariantItem
          index={variantItemsElements.length}
          key={variantForm.fieldId}
          variantForm={variantForm}
          stats={stats}
          mealsFormsStatsTrees={subtrees}
          foodsById={foodsById}
          portionsById={portionsById}
        />
      )
    }
  })

  return (
    <Document {...rest}>
      <Page
        style={[
          styles.page,
          { backgroundColor: getComputedColorFromChakra('gray.50') },
        ]}
      >
        <View
          fixed
          style={{
            backgroundColor: getComputedColorFromChakra('teal.500'),
            height: 10,
            alignItems: 'center',
            padding: 4,
            marginBottom: 24,
          }}
        />

        {variantItemsElements}
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    paddingBottom: 12,
  },
})

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src:
        'http://fonts.gstatic.com/s/roboto/v15/W5F8_SL0XFawnjxHGsZjJA.ttf',
      fontWeight: 'normal',
    },

    {
      src:
        'http://fonts.gstatic.com/s/roboto/v15/Uxzkqj-MIMWle-XP2pDNAA.ttf',
      fontWeight: 'medium',
    },

    {
      src:
        'http://fonts.gstatic.com/s/roboto/v15/bdHGHleUa-ndQCOrdpfxfw.ttf',
      fontWeight: 'bold',
    },
  ],
})

export default PdfDietEditor
