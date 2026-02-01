// ============================================================================
// THYREN API V12 - QUESTIONS 100% SERVEUR (ZÉRO LLM POUR QUESTIONS)
// ============================================================================

const DATA_COMPOSITIONS = `================================================================================
                         COMPOSITIONS SUPLEMINT
                              Version 0.9.0
================================================================================

Ce document contient la liste complète des gélules/capsules SUPLEMINT
avec leurs ingrédients et dosages exacts.

================================================================================
                              LISTE DES CAPSULES
================================================================================

--------------------------------------------------------------------------------
GÉLULE YAM®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : yam

Ingrédients :
  • Extrait de Yam (Dioscorea opposita) : 500 mg
  • Pullulane : non spécifié

Allégations :
  • L'Igname sauvage contribue au confort lors de la ménopause.

Alias : YAM, Gélule YAM, YAM®

--------------------------------------------------------------------------------
GÉLULE ADRENO+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Poudre d'algue Klamath (Aphanizomenon flos-aquae) : 200 mg (dont phycocyanine 11,3% = 22,6 mg)
  • Extrait de Bacopa monnieri : 150 mg (dont bacosides 50% = 75 mg)
  • Poudre de ginseng HRG80™ : 50 mg
  • Extrait de Panax ginseng CA Meyer : 50 mg (dont ginsénoïdes totaux 11,45 mg / dont ginseng rares 5 mg)
  • Extrait de Ginkgo biloba : 60 mg (dont glycosides de flavonol 24% = 14,4 mg / dont terpéno-lactones 6% = 3,6 mg)
  • L-Tyrosine : 37,5 mg
  • Oryza sativa L. : non spécifié

Alias : ADRENO+, ADRENO_PLUS, ADRENO+®

--------------------------------------------------------------------------------
GÉLULE OESTROBOOST®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Extrait de houblon (Humulus lupulus) : 262,5 mg
  • Extrait de houblon (Lifenol®) : 62,5 mg
  • Extrait de sauge sclarée (Salvia sclarea) : 25 mg
  • Extrait de sauge officinale (Salvia officinalis) : 25 mg

Allégations :
  • L'houblon contribue au bon sommeil, à la relaxation, à la santé digestive et au confort lors de la ménopause.
  • La sauge sclarée contribue aux défenses naturelles de l'organisme.
  • La sauge officinale contribue à la régulation de la transpiration.

Alias : OESTROBOOST, OESTROBOOST®

--------------------------------------------------------------------------------
GÉLULE BOURRACHE + ONAGRE®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : gélatine
Allergènes : aucun

Ingrédients :
  • Huile de bourrache (Borago officinalis L.) : 750 mg
  • Huile d'onagre (Oenothera biennis L.) : 750 mg
  • d-α tocophérol (vitamine E) : 22,5 mg

Allégations :
  • La bourrache contribue au bon fonctionnement des voies respiratoires et favorise le confort articulaire.
  • La vitamine E contribue à protéger les cellules contre le stress oxydatif.

Alias : BOURRACHE + ONAGRE, BOURRACHE_ONAGRE, BOURRACHE + ONAGRE®

--------------------------------------------------------------------------------
GÉLULE MULTI VIT®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun
Contient de l'iode : OUI

Ingrédients :
  • Bisglycinate de zinc : 60 mg (dont zinc élément 15 mg = 150% VNR)
  • Vitamine B3 (nicotinamide) : 54 mg (338% VNR)
  • Co-enzyme Q10 (ubiquinone) : 50 mg
  • Bio-flavonoïdes d'agrumes (Citrus sinensis) : 33,33 mg
  • N-AcétylCystéine : 33,33 mg
  • Quercétine : 33,33 mg
  • Acide alpha-lipoïque : 33,33 mg
  • Myrtille (Vaccinium myrtillus L.) : 33,33 mg
  • Vitamine C (acide L-ascorbique) : 26,67 mg (33% VNR)
  • Levure de sélénium : 25 mg (dont sélénium élément 50 µg = 91% VNR)
  • Vitamine B5 (D-Pantothénate de calcium) : 18 mg (300% VNR)
  • Vitamine E naturelle (Vitaphérole®) : 12 mg (100% VNR)
  • Rutine : 6,67 mg
  • Vitamine B1 (chlorhydrate de thiamine) : 3,6 mg (327% VNR)
  • Lycopène : 2,5 mg
  • Vitamine B2 (riboflavine) : 2,4 mg (171% VNR)
  • Oléorésine astaxanthine (Haematococcus pluvialis) : 2 mg
  • Lutéine : 2 mg
  • Vitamine B6 (pyridoxal phosphate) : 1,94 mg (139% VNR)
  • Bêta-carotène : 1,6 mg
  • Vitamine B8 (D-biotine) : 450 µg (900% VNR)
  • Zéaxanthine : 400 µg
  • Vitamine B9 (Quatrefolic®) : 200 µg (100% VNR)
  • Iodure de potassium : 150 µg (dont iode élément 114,6 µg = 76% VNR)
  • Vitamine K2 (ménaquinone) : 75 µg (100% VNR)
  • Vitamine D3 (cholécalciférol) : 25 µg = 1000 UI (500% VNR)
  • Vitamine B12 (méthylcobalamine) : 1,6 µg (64% VNR)
  • Vitamine B12 (hydroxycobalamine) : 1,6 µg (64% VNR)

Allégations :
  • Le zinc contribue au fonctionnement normal du système immunitaire.
  • Les vitamines B contribuent à un métabolisme énergétique normal.

Alias : MULTI VIT, MULTI_VIT, MULTI VIT®

--------------------------------------------------------------------------------
GÉLULE ENZYM+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : DRcaps™ (HPMC) gastrorésistante
Allergènes : aucun

Ingrédients :
  • Bromélaïne : 100 mg
  • Papaïne : 75 mg
  • Gingembre (Zingiber officinale) : 50 mg
  • Amylase : 25 mg
  • Lipase : 25 mg
  • Protéase (Ficus carica) : 25 mg
  • Trypsine : 25 mg

Allégations :
  • Le gingembre contribue au bon fonctionnement du système digestif.

Alias : ENZYM+, ENZYM_PLUS, ENZYM+®

--------------------------------------------------------------------------------
GÉLULE THYROÏDE+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun
Contient de l'iode : OUI

Ingrédients :
  • Guggul (Commiphora mukul) : 266 mg (dont 26,6 mg de guggulstérones)
  • Ashwagandha (KSM-66®) (Withania somnifera) : 200 mg (dont 10 mg de withanolides)
  • L-tyrosine : 166,6 mg
  • Fucus vésiculeux (Fucus vesiculosus) : 160 mg (dont 100 µg d'iode = 66,6% VNR)
  • Bisglycinate de zinc : 33,33 mg (dont 10 mg de zinc = 100% VNR)
  • Levure de sélénium : 18,3 mg (dont 36,6 µg de sélénium = 66,6% VNR)
  • Gluconate de manganèse : 5,4 mg (dont 0,66 mg de manganèse = 33,3% VNR)
  • Méthylcobalamine (Vitamine B12) : 8,3 µg (333,3% VNR)

Allégations :
  • L'iode contribue à la production normale d'hormones thyroïdiennes.
  • Le sélénium contribue à une fonction thyroïdienne normale.
  • Le zinc contribue à protéger les cellules contre le stress oxydatif.

Alias : THYROÏDE+, THYROIDE_PLUS, THYROIDE+®

--------------------------------------------------------------------------------
GÉLULE L-TYRO TOP®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • L-Tyrosine : 125 mg
  • Acide ascorbique (Vitamine C) : 30 mg (37,5% VNR)
  • Nicotinamide (Vitamine B3) : 6 mg (37,5% VNR)
  • Riboflavine (Vitamine B2) : 525 µg (37,5% VNR)
  • Chlorhydrate de pyridoxine (Vitamine B6) : 525 µg (37,5% VNR)
  • Quatrefolic® (Vitamine B9) : 75 µg (37,5% VNR)
  • Méthylcobalamine (Vitamine B12) : 0,94 µg (37,5% VNR)

Allégations :
  • La L-tyrosine contribue à la synthèse normale des catécholamines.

Alias : L-TYRO TOP, L_TYRO_TOP, L-TYRO TOP®

--------------------------------------------------------------------------------
GÉLULE L-TYRO ACTIV®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • L-Tyrosine : 500 mg

Allégations :
  • La L-tyrosine contribue à la synthèse normale des catécholamines.

Alias : L-TYRO ACTIV, L_TYRO_ACTIV, L-TYRO ACTIV®

--------------------------------------------------------------------------------
CAPSULE MAG TOP®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : HPMC
Allergènes : aucun

Ingrédients :
  • Bisglycinate de magnésium : 700 mg (dont 70 mg de magnésium élément)
  • Glycérophosphate de magnésium : 700 mg (dont 81,9 mg de magnésium élément)
  • Malate de magnésium : 250 mg (dont 37,5 mg de magnésium élément)

Allégations :
  • Le magnésium contribue au fonctionnement normal du système nerveux.
  • Le magnésium contribue à réduire la fatigue.

Alias : MAG TOP, MAG_TOP, MAG TOP®

--------------------------------------------------------------------------------
GÉLULE PHENOL+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Extrait de romarin (Rosmarinus officinalis) : 100 mg (dont 6% d'acide rosmarinique)
  • MitoActiv™ (cassis + groseille) : non spécifié (dont 10% de polyphénols)
  • Extrait de Sophora japonica : 50 mg (dont 98% de quercétine)
  • Extrait de pépin de raisin (Vitis vinifera) : 50 mg (dont 40% OPC et 30% monomères)
  • Extrait de cacao (Theobroma cacao) : 50 mg (dont 10% de polyphénols)
  • Extrait de grenade (Punica granatum) : 50 mg (dont 90% d'acide ellagique)
  • Extrait d'orange (Citrus sinensis) : 50 mg (dont 45% de polyphénols)
  • Extrait de feuille d'olivier (Olea europaea) : 50 mg (dont 20% d'hydroxytyrosol)
  • Extrait de myrtille (Vaccinium myrtillus) : 50 mg (dont 10% de polyphénols)
  • Extrait d'écorce de pin sylvestre (Pinus sylvestris) : non spécifié

Allégations :
  • Le romarin est un antioxydant naturel.
  • Le romarin favorise le bon fonctionnement du système immunitaire.

Alias : PHENOL+, PHENOL_PLUS, PHENOL+®

--------------------------------------------------------------------------------
GÉLULE ANTIOX®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : trace de caféine

Ingrédients :
  • Acérola (Malpighia glabra L.) : 160 mg (dont 25% de vitamine C)
  • Thé vert (Camellia sinensis) : 125 mg (dont 56,25 mg EGCG, caféine ≤ 10 mg)
  • Resvératrol : 100 mg
  • Co-enzyme Q10 : 100 mg
  • Raisin (Vitis vinifera L.) : 52,64 mg (dont 50 mg OPC)

Allégations :
  • La vitamine C contribue à protéger les cellules contre le stress oxydatif.

Alias : ANTIOX, ANTIOX®

--------------------------------------------------------------------------------
CAPSULE KRILL®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine de poisson
Allergènes : crustacés, poisson

Ingrédients :
  • Extrait lipidique de krill (Euphausia superba) : 590 mg
    - phospholipides 330 mg
    - oméga-3 160 mg (EPA+DHA 125 mg)
    - choline 41,12 mg
    - astaxanthine 60 µg

Alias : KRILL, KRILL®

--------------------------------------------------------------------------------
CAPSULE KLAMATH®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Poudre d'algue Klamath (Aphanizomenon flos-aquae) : 1000 mg
    - dont 56,5 mg phycocyanine
    - dont 5,5 mg phényléthylamine

Alias : KLAMATH, KLAMATH®

--------------------------------------------------------------------------------
CAPSULE OMEGA 3®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine de poisson
Allergènes : poisson

Ingrédients :
  • Huile de poisson (qualité EPAX) : 1000 mg
    - oméga-3 EPA+DHA 700 mg (EPA min 400 mg / DHA min 300 mg)

Allégations :
  • Le DHA contribue au fonctionnement normal du cerveau.
  • L'EPA et le DHA contribuent à une fonction cardiaque normale.

Alias : OMEGA 3, OMEGA3, OMEGA-3, OMEGA 3®

--------------------------------------------------------------------------------
GÉLULE BIO ACTIV®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : DRcaps™ (HPMC) gastrorésistante
Allergènes : aucun

Ingrédients :
  • Fibre d'acacia bio : non spécifié
  • Lactobacillus acidophilus : 3,32 milliards
  • Lactobacillus rhamnosus : 3,32 milliards
  • Bifidobacterium bifidum : 3,32 milliards
  • Bifidobacterium longum : 3,32 milliards
  • Bifidobacterium lactis : 3,32 milliards
  • Streptococcus thermophilus : 3,32 milliards

Alias : BIO ACTIV, BIO_ACTIV, BIO ACTIV®

--------------------------------------------------------------------------------
GÉLULE B9 4FOLIC®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Fibre d'acacia BIO : non spécifié
  • Acide folique (Quatrefolic®) : 360 µg (180% VNR)

Allégations :
  • Les folates contribuent à la croissance des tissus maternels durant la grossesse.

Alias : B94FOLIC, B9_4FOLIC, B9 4FOLIC®

--------------------------------------------------------------------------------
GÉLULE MG MALATE®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : gélatine bovine
Allergènes : gélatine bovine

Ingrédients :
  • Malate de magnésium : 1500 mg (dont 225 mg de magnésium élément = 60% VNR)

Allégations :
  • Le magnésium contribue à réduire la fatigue.

Alias : MG MALATE, MG_MALATE, MG MALATE®

--------------------------------------------------------------------------------
CAPSULE SVELT OMEGA 3®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine de poisson
Allergènes : poisson, crustacés

Ingrédients :
  • Huile de Calanus finmarchicus (crustacés) : 1000 mg

Allégations :
  • L'EPA et le DHA contribuent à une fonction cardiaque normale.

Alias : SVELT OMEGA 3, SVELT_OMEGA3, SVELT OMEGA3®

--------------------------------------------------------------------------------
GÉLULE BERBERINE ACTIV®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Berbérine HB® : 375 mg

Alias : BERBERINE ACTIV, BERBERINE_ACTIV, BERBERINE ACTIV®

--------------------------------------------------------------------------------
CAPSULE COQ10®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Co-enzyme Q10 LEO HB : non spécifié
  • Fibre d'acacia : non spécifié

Alias : COQ10, COQ10®

--------------------------------------------------------------------------------
GÉLULE ACETYL CARN®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Acétyl-L-Carnitine : 1500 mg

Alias : ACETYL CARN, ACETYL_CARN, ACETYL CARN®

--------------------------------------------------------------------------------
GÉLULE GASTRATOP®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun
Contient de l'iode : OUI

Ingrédients :
  • Gamma-Oryzanol : 250 mg
  • Fucus vésiculeux (Fucus vesiculosus) : 120 mg (dont 75 µg d'iode = 50% VNR)
  • Réglisse (Glycyrrhiza glabra) déglycyrrhizinée : 50 mg
  • Vitamine U (DL-Methionine Methylsulfonium Chloride) : 50 mg
  • L-Cystéine : 2,5 mg
  • Vitamine B1 (thiamine mononitrate) : 0,62 mg (56,4% VNR)

Alias : GASTRATOP, GASTRATOP®

--------------------------------------------------------------------------------
GÉLULE TRANSITEAM®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Enveloppe de psyllium (Plantago ovata) : 1500 mg
  • Gomme d'acacia bio : non spécifié
  • Lactobacillus acidophilus : 1250 millions
  • Lactobacillus rhamnosus : 1250 millions
  • Bifidobacterium bifidum : 1250 millions
  • Bifidobacterium longum : 1250 millions
  • Bifidobacterium lactis : 1250 millions
  • Streptococcus thermophilus : 1250 millions

Alias : TRANSITEAM, TRANSITEAM®

--------------------------------------------------------------------------------
GÉLULE VITAMINE C®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Vitamine C (acide L-ascorbique) : 650 mg (821% VNR)

Allégations :
  • La vitamine C contribue à réduire la fatigue.
  • La vitamine C contribue au fonctionnement normal du système immunitaire.

Alias : VITAMINE C, VITAMINE_C, VITAMINE C®

--------------------------------------------------------------------------------
GÉLULE MAGNESIUM+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : HPMC
Allergènes : aucun

Ingrédients :
  • Glycérophosphate de magnésium : 741,88 mg
  • Bisglycinate de magnésium : 300 mg (magnésium élément total = 146,8 mg = 39% VNR)
  • Taurine : 200 mg
  • Nicotinamide (Vitamine B3) : 17 mg (106% VNR)
  • Acide pantothénique (Vitamine B5) : 9 mg (150% VNR)
  • Pyridoxine (Vitamine B6) : 3,4 mg (243% VNR)
  • Thiamine (Vitamine B1) : 3,2 mg (290% VNR)
  • Riboflavine (Vitamine B2) : 2 mg (143% VNR)
  • D-biotine (Vitamine B8) : 150 µg (300% VNR)
  • Acide folique (Vitamine B9) : 100 µg (50% VNR)
  • Cholécalciférol (Vitamine D3) : 7,5 µg (150% VNR)
  • Méthylcobalamine (Vitamine B12) : 2 µg (80% VNR)

Allégations :
  • Le magnésium contribue au fonctionnement normal du système nerveux.
  • Le magnésium contribue à réduire la fatigue.

Alias : MAGNESIUM+, MAGNESIUM_PLUS, MAGNESIUM+®

--------------------------------------------------------------------------------
GÉLULE MELATOP®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Valériane (Valeriana officinalis L.) : 250 mg
  • Lavande (Lavandula angustifolia Mill.) : 150 mg
  • Passiflore (Passiflora incarnata L.) : 150 mg (dont 6 mg de flavonoïdes)
  • Eschscholzia de Californie (Eschscholzia californica) : 150 mg
  • GABA : 150 mg
  • Aubépine (Crataegus monogyna Jacq.) : 140 mg (dont 2,4 mg de vitexine)
  • Safran (Crocus sativus) : 45 mg
  • Arginine : 45 mg
  • Nicotinamide (Vitamine B3) : 37 mg (205% VNR)
  • Mélatonine : 0,299 mg

Allégations :
  • La mélatonine contribue à réduire le temps d'endormissement.
  • La valériane contribue à un sommeil de qualité.

Alias : MELATOP, MELATOP®

--------------------------------------------------------------------------------
GÉLULE ASHWAGANDHA®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Ashwagandha (KSM-66®) (Withania somnifera L.) : 600 mg (dont 30 mg de withanolides)

Allégations :
  • L'ashwagandha contribue à une bonne santé mentale et à la relaxation.
  • L'ashwagandha possède une action adaptogène.

Alias : ASHWAGANDHA, ASHWAGANDHA®

--------------------------------------------------------------------------------
GÉLULE L-CARNOSINE®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • L-Carnosine : 500 mg

Alias : L-CARNOSINE, L_CARNOSINE, L-CARNOSINE®

--------------------------------------------------------------------------------
GÉLULE BETA ALANINE®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Bêta-alanine : 500 mg
  • Poudre de Spirulina platensis : 100 mg

Alias : BETA ALANINE, BETA_ALANINE, BETA ALANINE®

--------------------------------------------------------------------------------
GÉLULE MACA®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Maca (Lepidium meyenii Walp) : 1000 mg

Allégations :
  • Le maca contribue à une fonction sexuelle saine.

Alias : MACA, MACA®

--------------------------------------------------------------------------------
GÉLULE STIM+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Eleutherococcus : 330 mg
  • Ginseng rouge (Panax ginseng C.) : 300 mg (dont 72 mg de ginsénosides)
  • Damiana (Turnera diffusa W.) : 300 mg
  • Fenugrec (Trigonella foenum-graecum L.) : 300 mg
  • Extrait d'écorce de pin sylvestre (Pinus sylvestris) : 60 mg
  • Nicotinamide (Vitamine B3) : 54 mg (337,5% VNR)
  • KaempMax (Kaempferia parviflora) : 45 mg
  • Bisglycinate de zinc : 45 mg (dont 11,25 mg de zinc = 112,5% VNR)
  • Safran (Crocus sativus L.) : 30 mg

Allégations :
  • Le zinc contribue au maintien d'un taux normal de testostérone.
  • Le ginseng contribue à la vitalité.

Alias : STIM+, STIM_PLUS, STIM+®

--------------------------------------------------------------------------------
GÉLULE RELAX+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Lavande (Lavandula angustifolia) : 160 mg
  • Passiflore (Passiflora incarnata L.) : 160 mg
  • Valériane (Valeriana officinalis L.) : 160 mg
  • Mélisse (Melissa officinalis) : 115,96 mg (dont acide hydroxycinnamique 20,48%, acide rosmarinique 7,26%)
  • Aubépine (Crataegus laevigata) : 110 mg
  • Eschscholtzia californica Cham. : 110 mg
  • GABA (acide gamma aminobutyrique) : 100 mg
  • Nicotinamide (Vitamine B3) : 36 mg (225% VNR)
  • Safran (Crocus sativus) : 30 mg (dont 12% safromotivines, 3% crocine, 2% safranal)
  • L-arginine : 30 mg

Allégations :
  • La passiflore contribue à un sommeil sain.
  • La valériane contribue à la relaxation.

Alias : RELAX+, RELAX_PLUS, RELAX+®

--------------------------------------------------------------------------------
GÉLULE RECUP+®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : gélatine bovine
Allergènes : gélatine bovine

Ingrédients :
  • Citrate de potassium anhydre : 900 mg (dont 324 mg potassium élément = 16,2% VNR)
  • Citrate de magnésium anhydre : 600 mg (dont 97,2 mg magnésium élément = 25,9% VNR)

Allégations :
  • Le magnésium contribue à une fonction musculaire normale.
  • Le potassium contribue à une fonction musculaire normale.

Alias : RECUP+, RECUP_PLUS, RECUP+®

--------------------------------------------------------------------------------
GÉLULE CURCUM ARTI®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Acujoint™ : 250 mg (dont 30 mg de curcuminoïdes, 25 mg de bêta-caryophyllène, 12,5 mg de Bio-AKBA)
  • Curcuma (Cureit®) : 250 mg (dont 125 mg de curcuminoïdes)
  • Extrait de Boswellia serrata : 250 mg (dont 162,5 mg d'acides boswelliques)

Allégations :
  • Le curcuma contribue à la santé des articulations.
  • La boswellia contribue à la souplesse et au confort articulaire.

Alias : CURCUM ARTI, CURCUM_ARTI, CURCUM ARTI®

--------------------------------------------------------------------------------
CAPSULE ONAGRE B®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine
Allergènes : aucun

Ingrédients :
  • Huile de bourrache (Borago officinalis L.) : 500 mg (dont 100 mg d'acide gamma linoléique GLA)
  • Huile d'onagre (Oenothera biennis L.) : 500 mg (dont 45 mg d'acide gamma linoléique GLA)
  • Vitamine E naturelle : 15 mg (dont 10 mg de d-α tocophérol = 125% VNR)

Allégations :
  • La vitamine E contribue à protéger les cellules contre le stress oxydatif.

Alias : ONAGRE B, ONAGRE_B, ONAGRE B®

--------------------------------------------------------------------------------
CAPSULE SKIN ACTIV®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine de bœuf
Allergènes : gluten, gélatine bovine

Ingrédients :
  • Extrait de blé concentré en phytocéramides : non spécifié
  • Oxyde de zinc : non spécifié
  • Extrait de romarin : non spécifié
  • Huile de graines de tournesol : non spécifié

Allégations :
  • Le zinc contribue au maintien d'une peau normale.

Alias : SKIN ACTIV, SKIN_ACTIV, SKIN ACTIV®

--------------------------------------------------------------------------------
CAPSULE HEPATOP®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Triméthylglycine : 240 mg
  • Phosphatidylcholine : 170 mg
  • Chlorella pyrenoidosa : 150 mg
  • Extrait de radis noir (Raphanus sativus) : 90 mg
  • Extrait d'artichaut (Cynara scolymus) : 90 mg (dont 4,5 mg de cynarine)
  • Extrait de chardon-marie (Silybum marianum) : 90 mg (dont 72 mg de silymarine)
  • N-acétyl-L-cystéine : 80 mg

Allégations :
  • L'artichaut contribue à la fonction hépatique normale.
  • Le chardon-marie contribue à la santé du foie.

Alias : HEPATOP, HEPATOP®

--------------------------------------------------------------------------------
CAPSULE RENATOP®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Extrait de feuille de pissenlit (Taraxacum officinale) : 200 mg (dont 6 mg de vitexine)
  • Extrait de fleur de piloselle (Hieracium pilosella) : 200 mg
  • Poudre d'Hibiscus sabdariffa : 200 mg (dont 40 mg d'acides)

Allégations :
  • Le pissenlit contribue à la fonction rénale normale.
  • La piloselle favorise l'élimination rénale de l'eau.

Alias : RENATOP, RENATOP®

--------------------------------------------------------------------------------
CAPSULE IMMUNO®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Quercétine : 250 mg
  • Ginseng (Panax ginseng C.) : 150 mg (dont 36 mg de ginsénosides)
  • Reishi (Ganoderma lucidum) : 150 mg (dont 50 mg de β-glucane)
  • Shiitake (Lentinula edodes) : 150 mg (dont 50 mg de β-(1,3/1,6)-glucane)
  • Cordyceps sinensis : 150 mg
  • Propolis Bio : 150 mg
  • Vitamine C : 90 mg (112,5% VNR)
  • Betavia™ (Euglena gracilis) : 70 mg
  • Bisglycinate de Zinc : 45 mg (dont 11,25 mg de zinc = 112,5% VNR)
  • Vitamine D3 (cholécalciférol) : 50 µg (1000% VNR)

Allégations :
  • La vitamine C contribue au fonctionnement normal du système immunitaire.
  • Le zinc contribue au fonctionnement normal du système immunitaire.
  • La vitamine D contribue au fonctionnement normal du système immunitaire.

Alias : IMMUNO, IMMUNO®

--------------------------------------------------------------------------------
GÉLULE QUERCÉTINE®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Quercétine : 500 mg

Alias : QUERCETINE, QUERCÉTINE, QUERCETINE®

--------------------------------------------------------------------------------
GÉLULE TEA ACTIV®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : trace de caféine

Ingrédients :
  • Extrait de thé vert (Camellia sinensis) : 500 mg (présence naturelle de caféine)

Allégations :
  • Le thé vert contribue au métabolisme des lipides.

Alias : TEA ACTIV, TEA_ACTIV, TEA ACTIV®

--------------------------------------------------------------------------------
CAPSULE CARDIO+®
--------------------------------------------------------------------------------
Forme : capsule
Enveloppe : gélatine de poisson
Allergènes : poisson

Ingrédients :
  • Oméga-3 (EPA + DHA) : non spécifié (source marine)
  • Co-enzyme Q10 : non spécifié

Allégations :
  • L'EPA et le DHA contribuent à une fonction cardiaque normale.

Alias : CARDIO+, CARDIO_PLUS, CARDIO+®

--------------------------------------------------------------------------------
GÉLULE GUDZU®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Kudzu (Pueraria lobata) : 1000 mg

Alias : GUDZU, KUDZU, GUDZU®

--------------------------------------------------------------------------------
GÉLULE LACTOP®
--------------------------------------------------------------------------------
Forme : gélule
Enveloppe : pullulane
Allergènes : aucun

Ingrédients :
  • Lactase : non spécifié

Allégations :
  • La lactase améliore la digestion du lactose.

Alias : LACTOP, LACTOP®

================================================================================
                              FIN DU DOCUMENT
================================================================================
`;
const DATA_CURES = `================================================================================
                           LES CURES SUPLEMINT
                              Version 0.9.0
================================================================================

RÈGLES GÉNÉRALES :
- Durée d'une cure : 30 jours
- Cycle recommandé : 3 à 6 mois
- Pause entre les cycles : 1 mois
- Maximum de cures simultanées : 3
- Recommandation : 2 cures simultanées, idéalement CURE THYROÏDE + une autre

================================================================================
                           LISTE DES 21 CURES
================================================================================

--------------------------------------------------------------------------------
CURE 1 : CURE THYROÏDE
--------------------------------------------------------------------------------
Description : Optimise le fonctionnement de ta thyroïde.
Moment de prise : le matin à jeun juste avant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-thyroide

Composition journalière :
  • 1x ADRENO_PLUS
  • 1x MULTI_VIT
  • 1x THYROIDE_PLUS
  • 1x L_TYRO_ACTIV

Recommandée pour :
  - Hypothyroïdie diagnostiquée
  - Bilan thyroïde anormal
  - Fatigue constante
  - Prise de poids inexpliquée
  - Frilosité
  - Humeur basse
  - Sommeil non réparateur
  - Peau sèche / cheveux cassants
  - Transit lent
  - Gonflement visage/mains
  - Difficulté de concentration

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ❌ Interdiction en cas d'hyperthyroïdie.
  ⚠️ Déconseillé en cas de maladies auto-immunes.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ⚠️ Déconseillé en cas d'épilepsie.
  ⚠️ Déconseillé en cas d'acte interventionnel invasif programmé.

Notes :
  → La cure essentielle et principale de chez SUPLEMINT, peut résoudre 70% des problématiques exprimées dans le questionnaire QUESTION THYREN donc la proposer si ≥ deux réponses positives.
  → En cas de maladie auto-immune de la thyroïde (Hashimoto ou Basedow), la cure peut être recommandée d'après le Dr Stéphane Résimont. Toutefois, légalement, il est préférable de prendre rendez-vous avec l'une de nos expertes (Françoise) ou votre médecin traitant.

--------------------------------------------------------------------------------
CURE 2 : CURE INTESTIN
--------------------------------------------------------------------------------
Description : Améliore ton transit et ta digestion.
Moment de prise : durant le repas le plus important
Lien : https://www.suplemint.com/products/cure-intestin

Composition journalière :
  • 1x GASTRATOP
  • 1x ENZYM_PLUS
  • 3x TRANSITEAM

Recommandée pour :
  - Transit lent ou constipation
  - Prise de poids inexpliquée
  - Peau terne ou sèche

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement anticoagulant coumariniques.

Notes :
  → Cette cure en plus de son action sur la digestion et le transit est parfaite pour préparer le terrain pour la cure thyroïde.

--------------------------------------------------------------------------------
CURE 3 : CURE ÉNERGIE
--------------------------------------------------------------------------------
Description : Retrouve vitalité et tonus.
Moment de prise : le matin à jeun juste avant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-energie

Composition journalière :
  • 1x VITAMINE_C
  • 1x COQ10
  • 1x OMEGA3
  • 1x L_TYRO_ACTIV
  • 1x MAGNESIUM_PLUS

Recommandée pour :
  - Fatigue constante
  - Moral fluctuant
  - Difficulté de concentration

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

Notes :
  → Cette cure est parfaite pour avoir un effet 'Waouh' boost immédiat.

--------------------------------------------------------------------------------
CURE 4 : CURE POIDS
--------------------------------------------------------------------------------
Description : Facilite ta perte de poids naturellement.
Moment de prise : le matin à jeun juste avant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-poids

Composition journalière :
  • 1x COQ10
  • 2x OMEGA3
  • 1x BERBERINE_ACTIV
  • 2x ACETYL_CARN

Recommandée pour :
  - Prise de poids inexpliquée
  - Transit lent
  - Fatigue constante

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.

Notes :
  → Cette cure a de super résultats si elle est prise à la suite d'INTESTIN et THYROIDE.

--------------------------------------------------------------------------------
CURE 5 : CURE IMMUNITÉ
--------------------------------------------------------------------------------
Description : Renforce vos défenses naturelles.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-immunite

Composition journalière :
  • 3x IMMUNO
  • 1x BIO_ACTIV

Recommandée pour :
  - Fatigue
  - Peau sèche
  - Transit perturbé

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.

--------------------------------------------------------------------------------
CURE 6 : CURE SENIOR
--------------------------------------------------------------------------------
Description : Accompagne le vieillissement en douceur.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-senior

Composition journalière :
  • 1x COQ10
  • 1x OMEGA3
  • 1x MULTI_VIT
  • 1x BETA_ALANINE
  • 1x L_CARNOSINE

Recommandée pour :
  - Âge > 60 ans
  - Fatigue
  - Peau/cheveux fragiles

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ❌ Interdiction problèmes rénaux (goutte, calculs).

--------------------------------------------------------------------------------
CURE 7 : CURE SOMMEIL
--------------------------------------------------------------------------------
Description : Favorise un sommeil réparateur.
Moment de prise : le soir au coucher
Lien : https://www.suplemint.com/products/cure-sommeil

Composition journalière :
  • 3x MELATOP
  • 1x ASHWAGANDHA
  • 1x MAGNESIUM_PLUS

Recommandée pour :
  - Sommeil non réparateur
  - Humeur fluctuante

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 8 : CURE COMPLÈTE
--------------------------------------------------------------------------------
Description : Couvre l'ensemble des besoins essentiels.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-complete

Composition journalière :
  • 1x MULTI_VIT
  • 1x MAG_TOP
  • 1x PHENOL_PLUS
  • 1x ANTIOX

Recommandée pour :
  - Toutes réponses légèrement positives sans pathologie marquée

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ❌ Interdiction problèmes rénaux (goutte, calculs).
  ⚠️ Déconseillé en cas de maladies auto-immunes.

--------------------------------------------------------------------------------
CURE 9 : CURE HOMME+
--------------------------------------------------------------------------------
Description : Soutient la vitalité masculine et la libido.
Moment de prise : le soir juste avant le dîner
Lien : https://www.suplemint.com/products/cure-homme

Composition journalière :
  • 1x COQ10
  • 1x OMEGA3
  • 3x STIM_PLUS
  • 2x MACA

Recommandée pour :
  - Sexe : Homme
  - Fatigue
  - Baisse motivation

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 10 : CURE ZÉNITUDE
--------------------------------------------------------------------------------
Description : Aide à réduire le stress et l'anxiété.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-zenitude

Composition journalière :
  • 1x ASHWAGANDHA
  • 3x MG_MALATE
  • 2x RELAX_PLUS

Recommandée pour :
  - Humeur fluctuante
  - Sommeil léger
  - Difficulté de concentration

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 11 : CURE DÉTOX
--------------------------------------------------------------------------------
Description : Purifie le foie et les reins.
Moment de prise :
  - Matin à jeun juste avant le petit déjeuner
  - Soir juste avant le dîner
Lien : https://www.suplemint.com/products/cure-detox

Composition journalière :
  • 2x HEPATOP (matin)
  • 2x RENATOP (soir)

Recommandée pour :
  - Transit lent
  - Gonflement visage/mains

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

--------------------------------------------------------------------------------
CURE 12 : CURE ARTICULATION
--------------------------------------------------------------------------------
Description : Protège et renforce vos articulations.
Moment de prise : durant le repas le plus important
Lien : https://www.suplemint.com/products/cure-articulation

Composition journalière :
  • 1x OMEGA3
  • 2x CURCUM_ARTI

Recommandée pour :
  - Âge > 45 ans
  - Douleurs articulaires éventuelles

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ❌ Interdiction en cas d'ulcères gastrique ou duodénal ou de calculs biliaires.

--------------------------------------------------------------------------------
CURE 13 : CURE PEAU
--------------------------------------------------------------------------------
Description : Améliore l'aspect et la santé de ta peau.
Moment de prise : durant le repas le plus important
Lien : https://www.suplemint.com/products/cure-peau

Composition journalière :
  • 2x ONAGRE_B
  • 1x PHENOL_PLUS
  • 1x SKIN_ACTIV

Recommandée pour :
  - Peau sèche
  - Transit lent

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

--------------------------------------------------------------------------------
CURE 14 : CURE MÉNOPAUSE
--------------------------------------------------------------------------------
Description : Accompagne l'équilibre hormonal.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-menopause

Composition journalière :
  • 2x YAM
  • 1x OESTROBOOST
  • 3x ONAGRE_B
  • 1x MULTI_VIT
  • 1x ENZYM_PLUS

Recommandée pour :
  - Sexe : Femme
  - Âge 45–60 ans
  - Humeur fluctuante
  - Sommeil perturbé

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ⚠️ Déconseillé en cas d'antécédent personnel ou familial de cancers hormono-dépendants.
  ❌ Interdiction des traitements anticoagulant coumariniques.

--------------------------------------------------------------------------------
CURE 15 : CURE SPORT
--------------------------------------------------------------------------------
Description : Soutient l'endurance et la récupération.
Moment de prise : juste avant l'activité sportive
Lien : https://www.suplemint.com/products/cure-sport

Composition journalière :
  • 1x KLAMATH
  • 3x RECUP_PLUS
  • 1x L_TYRO_ACTIV
  • 1x BETA_ALANINE
  • 1x L_CARNOSINE

Recommandée pour :
  - Bonne énergie
  - Pratique sportive régulière

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ⚠️ Déconseillé en cas de maladies auto-immunes.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 16 : CURE MÉMOIRE
--------------------------------------------------------------------------------
Description : Stimule la concentration et la clarté mentale.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-memoire

Composition journalière :
  • 1x KRILL
  • 1x MULTI_VIT
  • 1x MAG_TOP
  • 2x KLAMATH

Recommandée pour :
  - Difficulté de concentration
  - Âge > 45 ans

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ⚠️ Déconseillé en cas de maladies auto-immunes.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 17 : CURE ADDICT FREE
--------------------------------------------------------------------------------
Description : Aide à arrêter de fumer.
Moment de prise : le matin à jeun juste avant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-addicfree

Composition journalière :
  • 1x OMEGA3
  • 2x L_TYRO_ACTIV
  • 2x KLAMATH
  • 4x GUDZU

Recommandée pour :
  - Utilisateur fumeur
  - Fatigue
  - Humeur fluctuante

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

--------------------------------------------------------------------------------
CURE 18 : CURE CONCEPTION
--------------------------------------------------------------------------------
Description : Optimise la fertilité.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-conception

Composition journalière :
  • 1x COQ10
  • 1x OMEGA3
  • 1x B9_4FOLIC
  • 2x MG_MALATE
  • 1x MULTI_VIT

Recommandée pour :
  - Projet de grossesse
  - Sexe : Femme
  - Âge < 40

Contre-indications :
  ❌ Interdiction de grossesse plus de 7 mois ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ⚠️ Déconseillé en cas de maladies auto-immunes.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 19 : CURE ALLAITEMENT
--------------------------------------------------------------------------------
Description : Soutient la production de lait et l'énergie post-partum.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-allaitement

Composition journalière :
  • 1x OMEGA3
  • 1x MULTI_VIT
  • 2x LACTOP
  • 2x MG_MALATE

Recommandée pour :
  - Allaitement en cours
  - Fatigue post-partum

Contre-indications :
  ❌ Interdiction de grossesse.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.
  ❌ Interdiction traitement contre le diabète.
  ❌ Interdiction des traitements anticoagulant coumariniques.
  ⚠️ Déconseillé en cas de maladies auto-immunes.
  ⚠️ Déconseillé aux personnes sous traitement antidépresseur.

--------------------------------------------------------------------------------
CURE 20 : CURE ANTIOXYDANT
--------------------------------------------------------------------------------
Description : Protège du vieillissement cellulaire.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-antioxydant

Composition journalière :
  • 1x PHENOL_PLUS
  • 1x VITAMINE_C
  • 1x QUERCETINE
  • 1x TEA_ACTIV

Recommandée pour :
  - Âge > 45 ans
  - Fatigue
  - Peau terne

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

--------------------------------------------------------------------------------
CURE 21 : CURE CARDIO
--------------------------------------------------------------------------------
Description : Favorise la santé cardiaque et circulatoire.
Moment de prise : le matin durant le petit déjeuner
Lien : https://www.suplemint.com/products/cure-cardio

Composition journalière :
  • 2x OMEGA3
  • 2x ACETYL_CARN
  • 3x CARDIO_PLUS
  • 1x COQ10

Recommandée pour :
  - Âge > 60 ans
  - Frilosité
  - Gonflement

Contre-indications :
  ❌ Interdiction de grossesse ou d'allaitement.
  ⚠️ Déconseillé aux enfants de moins de 12 ans.

================================================================================
                       RÉSUMÉ : CURES CONTENANT DU POISSON
================================================================================

Les cures suivantes contiennent des ingrédients d'origine marine (poisson/crustacés) :

1. CURE ÉNERGIE (OMEGA3)
2. CURE POIDS (OMEGA3)
3. CURE SENIOR (OMEGA3)
4. CURE HOMME+ (OMEGA3)
5. CURE ARTICULATION (OMEGA3)
6. CURE MÉMOIRE (KRILL)
7. CURE ADDICT FREE (OMEGA3)
8. CURE CONCEPTION (OMEGA3)
9. CURE ALLAITEMENT (OMEGA3)
10. CURE CARDIO (OMEGA3 + CARDIO_PLUS)

================================================================================
                              FIN DU DOCUMENT
================================================================================
`;
const DATA_SAV = `================================================================================
                         FAQ & SAV SUPLEMINT
                              Version 1.0.0
================================================================================

================================================================================
                         À PROPOS DE SUPLEMINT
================================================================================

Q: Suplemint est-elle une entreprise belge ?
R: Oui. Suplemint est une entreprise 100% belge, fondée en 2021 par Adrien et Maïté Chassaing.
   - Bureaux : 431H Chaussée de Louvain, 1380 Lasne (1er étage), Brabant wallon
   - Siège social : 64 Chemin de Bas Ransbeck, Lasne
   - Toute la gestion, conception, conditionnement et logistique sont pilotées depuis la Belgique
   - Succursales au Luxembourg et en France

---

Q: Comment nous contacter ?
R: 
   - Email : info@suplemint.com
   - Téléphone : +32 2 884 56 99 (lun-ven, 9h-19h)
   - Formulaire : www.suplemint.com/pages/contact
   - IA THYREN disponible 24/7

================================================================================
                         NOS PRODUITS & CURES
================================================================================

Q: Quels types de cures proposez-vous ?
R: Cures naturelles de micronutrition ciblée pour : thyroïde, énergie, sommeil, immunité, fertilité, digestion, ménopause, et plus.
   - Formules élaborées avec ingrédients naturels
   - Actifs hautement biodisponibles
   - Développées avec médecins, pharmaciens et experts en médecine fonctionnelle
   - Expertise phare : Cure Thyroïde 2.0
   - Disponibles à l'unité (1 mois), en packs multi-mois, ou par abonnement flexible
   Lien : https://www.suplemint.com/collections/trouvezvotrecure

---

Q: Vendez-vous les compléments seuls ?
R: Oui. En plus des cures complètes, nous proposons certains compléments individuels :
   Melatop, CoQ10, Omega 3, Magnésium+, Vitamine C, Multivit
   Disponibles au mois, en plusieurs mois, ou par abonnement mensuel.
   Lien : https://www.suplemint.com/collections/trouvezvotrecure

---

Q: Combien de temps avant de sentir des résultats ?
R: 
   - Dès 1-2 semaines : premiers effets possibles (énergie, sommeil, confort digestif)
   - Après 1 mois : premiers bénéfices observables mais durée souvent courte pour action profonde
   - À partir de 3 mois : recommandation minimale pour action complète
   - 6 mois ou plus : résultats durables, surtout pour thyroïde et équilibre hormonal
   La régularité est plus importante que la perfection quotidienne.

---

Q: Compatibilité avec un traitement médical ?
R: Ça dépend du traitement et de la cure.
   Compatible : Cure Thyroïde avec traitement hypothyroïdie (validé par médecins internes)
   Contre-indiqué : Cure Poids avec anticoagulants antivitamine K (anticoumariniques)
   Toujours consulter les contre-indications sur chaque page produit.
   En cas de doute, demander l'avis d'un professionnel de santé.

---

Q: Grossesse, allaitement et enfants ?
R: 
   GROSSESSE :
   - Seule Cure Conception autorisée
   - Arrêt impératif avant le 7ème mois (oméga-3 fluidifient le sang)
   - Toutes autres cures contre-indiquées

   ALLAITEMENT :
   - Seule Cure Allaitement autorisée (formulée spécifiquement)
   - Toutes autres cures contre-indiquées

   ENFANTS :
   - Cures non recommandées avant 12 ans
   - Par sécurité, utilisation préconisée à partir de 18 ans

---

Q: Quand prendre mes compléments ?
R: 
   - Compléments énergisants (énergie, thyroïde, métabolisme) : le matin
   - Compléments sommeil/relaxation : le soir
   - Certaines gélules au milieu ou fin de repas pour meilleure tolérance digestive

   Instructions détaillées sur :
   - Page produit
   - Dos de la boîte
   - Chaque sachet
   - Carte explicative incluse (QR code)

   L'essentiel est la régularité.

================================================================================
                         CONSEILS GÉNÉRAUX
================================================================================

Q: Si j'oublie de prendre une dose ?
R: Pas de panique.
   - Ne JAMAIS doubler la dose suivante
   - Sauter simplement la prise oubliée et reprendre normalement
   - En micronutrition, l'observance et l'endurance dans le temps sont clés
   - Un oubli ponctuel n'a aucun impact significatif
   - Si plus de 30-35% des prises oubliées, effet moins optimal
   
   Règle : Un oubli = aucun souci. Régularité = résultats. Durée = bénéfices durables.

---

Q: Puis-je prendre d'autres compléments en plus ?
R: En théorie oui, mais généralement pas nécessaire. Nos cures sont déjà hautement dosées et équilibrées.

   Si cumul :
   - Vérifier les compositions pour éviter doublons
   - Ne pas dépasser doses journalières recommandées

   Vigilance particulière sur :
   - Vitamine A : max 800 µg/jour
   - Vitamine D : max 3000 UI/jour (75 µg)
   - Vitamine E : max 300 mg/jour
   - Vitamine B6 : max 25 mg/jour
   - Fer : max 14-20 mg/jour
   - Zinc : max 25 mg/jour
   - Sélénium : max 200 µg/jour
   - Iode : max 150-200 µg/jour
   - Oméga-3 : max 3 g/jour sans avis médical

---

Q: Qu'est-ce qui justifie le prix des cures ?
R: 
   - Qualité des matières premières (actifs premium, biodisponibles, brevetés)
   - Complexité des formules (plusieurs compléments combinés pour action 360°)
   - Travail d'experts (médecins, pharmaciens, spécialistes médecine fonctionnelle)
   - Suivi scientifique régulier

   Exemple Cure Thyroïde :
   - Équivalent en compléments séparés = 343€
   - Pack Suplemint = 125€
   - Économie de 218€

================================================================================
                    ALLERGIES & TYPES D'ALIMENTATION
================================================================================

Q: Sans gluten et sans lactose ?
R: Aucun gluten ni lactose ajoutés, SAUF Cure Peau (gélule SKIN ACTIV peut en contenir).

   Attention : fabrication dans installations multi-produits manipulant aussi blé, soja, lactose, maïs, oeuf, poisson, crustacés, fruits à coque, arachides, gluten. Contamination croisée possible.
   Si allergie sévère : consulter médecin et vérifier liste ingrédients.

---

Q: Allergène poisson & dérivés marins ?
R: Cures contenant poisson/dérivés marins (oméga-3, krill) :
   1. Cure Énergie
   2. Cure Poids
   3. Cure Immunité
   4. Cure Senior
   5. Cure Mémoire (krill + oméga-3)
   6. Cure Homme+
   7. Cure Cardio
   8. Cure Articulation
   9. Cure Addict Free
   10. Cure Conception
   11. Cure Allaitement

   Aucune autre cure ne contient d'ingrédients marins.
   Avis médical indispensable si allergie poisson ou crustacés.

---

Q: Végétarien ou végétalien ?
R: Selon les formules : certaines cures végétariennes, d'autres contiennent oméga-3 issus d'huile de poisson (certifiés pêche durable).
   - Actuellement, aucune cure 100% végétalienne
   - Information végétarien/non végétarien précisée dans description produit

================================================================================
                              PAIEMENT
================================================================================

Q: Moyens de paiement acceptés ?
R: 
   En ligne :
   - Apple Pay
   - Carte de crédit
   - PayPal
   - Bancontact
   - iDEAL
   - Klarna

   Sur place :
   - Terminal bancaire
   - Espèces (cash)

   Tous paiements traités via solutions sécurisées conformes aux standards.

---

Q: Comment utiliser un code promotionnel ?
R: 
   1. Ajouter produits au panier
   2. Page de paiement
   3. Entrer code dans le champ prévu avant paiement

   Un seul code à la fois (le plus avantageux appliqué automatiquement)
   Codes cumulables avec réductions automatiques :
   - -15% abonnements
   - -10% dès 2 produits
   - -15% dès 3 produits

---

Q: Mon code ne fonctionne pas ?
R: Possible si :
   - Code déjà utilisé
   - Code expiré
   - Code non applicable aux produits du panier
   Si code valide selon vous, contacter info@suplemint.com pour vérification.

================================================================================
                         COMMANDES & EXPÉDITIONS
================================================================================

Q: Délais de livraison ?
R: 
   - Benelux : 2-3 jours ouvrés (GLS)
   - France : 2-5 jours ouvrés (GLS)
   - Suisse (DAP) : 3-6 jours ouvrés (Bpost, aucun frais de douane)
   - Europe : 3-6 jours ouvrés (Bpost)
   - USA : 4-6 jours ouvrés (Bpost)
   - International : 6-12 jours ouvrés (Bpost)

   En cas d'absence : dépôt en point relais le plus proche.

---

Q: Comment vérifier le statut de ma commande ?
R: Après commande : email de confirmation, puis emails de suivi (préparé, expédié, en cours de livraison, livré).
   Chaque email contient lien de suivi (tracking).
   Suivi Shopify et suivi transporteur peuvent différer légèrement, attendre 24h pour synchronisation.

---

Q: Ma commande est en retard ?
R: 
   1. Vérifier le tracking via lien email
   2. Vérifier spams/indésirables
   
   Si retard prévisible connu (fêtes, etc.), nous informons par email.
   Si retard > 5 jours ouvrables : contacter info@suplemint.com avec numéro de commande, ou appeler +32 2 884 56 99.

---

Q: Annuler ma commande ?
R: Possible tant que colis non expédié.
   - Commandes avant 11h : expédiées le jour même
   - Commandes après 11h : expédiées le lendemain
   Contacter rapidement info@suplemint.com ou +32 2 884 56 99.
   Après expédition : retour possible sous 14 jours.

---

Q: Modifier ma commande ?
R: Possible avant expédition (ajouter/retirer produit, modifier cure).
   Contacter rapidement info@suplemint.com ou +32 2 884 56 99.

---

Q: Mauvais produit ou produit endommagé ?
R: Contacter info@suplemint.com ou +32 2 884 56 99 avec :
   - Numéro de commande
   - Photo du produit reçu/endommagé
   Solution : remplacement ou renvoi.

================================================================================
                              ABONNEMENT
================================================================================

Q: Avantages de l'abonnement ?
R: 
   - -15% sur le prix total
   - Livraison offerte
   - Pilulier offert (1ère commande)
   - Suivi mensuel offert avec nutritionniste
   - Envoi automatique tous les 30 jours
   - Sans engagement, annulable à tout moment

================================================================================
                         CODES PROMOTIONNELS ACTIFS
================================================================================

Code : STANARNOW10
Offre : -10% à l'inscription newsletter
Conditions : Nouveaux inscrits uniquement

Code : JANVIER30
Offre : -30% sur chaque commande
Conditions : Valable janvier 2026 uniquement

================================================================================
                    RENDEZ-VOUS & ACCOMPAGNEMENT
================================================================================

Q: Comment prendre rendez-vous avec un expert ?
R: Nos nutritionnistes sont disponibles pour un échange gratuit et personnalisé.
   Prendre rendez-vous via : https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252

================================================================================
                              FIN DU DOCUMENT
================================================================================
`;

console.log("✅ THYREN V12 chargé");

// ============================================================================
// QUIZ - FLOW EXACT DES QUESTIONS
// ============================================================================

const QUIZ_FLOW = [
  { id: "Q1", type: "open", text: "Parfait, trouvons ensemble la cure idéale pour vous. Pour commencer, quel est votre prénom ?", key: "prenom" },
  { id: "Q2", type: "choice", text: "Bonjour {prenom}, quel est votre sexe biologique ?", choices: ["Femme", "Homme"], key: "sexe" },
  { id: "Q2_plus", type: "choice", text: "Êtes-vous enceinte ou allaitante ?", choices: ["Oui", "Non"], key: "enceinte", condition: (a) => a.sexe === "Femme" },
  { id: "Q3", type: "choice", text: "Quel est votre âge ?", choices: ["Moins de 30 ans", "30-45 ans", "45-60 ans", "Plus de 60 ans"], key: "age" },
  { id: "Q3_meno", type: "choice", text: "Concernant votre cycle hormonal, où en êtes-vous ?", choices: ["Je suis ménopausée", "Symptômes de préménopause", "Pas de symptômes particuliers"], key: "menopause", condition: (a) => a.sexe === "Femme" && (a.age === "45-60 ans" || a.age === "Plus de 60 ans") },
  { id: "Q4", type: "choice", text: "Avez-vous une condition médicale, une allergie, ou prenez-vous un traitement ?", choices: ["Tout va bien", "Oui, j'ai quelque chose à signaler"], key: "condition" },
  { id: "Q4b", type: "open", text: "Merci de préciser votre condition ou allergie.", key: "condition_detail", condition: (a) => a.condition === "Oui, j'ai quelque chose à signaler" },
  { id: "Q5", type: "open", text: "{prenom}, qu'est-ce qui vous pèse le plus au quotidien ? Décrivez librement ce que vous ressentez.", key: "plainte" },
  { id: "Q5b", type: "choice", text: "Depuis combien de temps ressentez-vous ces désagréments ?", choices: ["Moins d'un mois", "1 à 6 mois", "6 mois à 1 an", "Plus d'un an"], key: "duree" },
  { id: "Q5c", type: "choice", text: "Comment évalueriez-vous l'impact sur votre quotidien ?", choices: ["Léger", "Modéré", "Important", "Sévère"], key: "impact" },
  { id: "Q6", type: "choice", text: "Comment décririez-vous votre niveau d'énergie ?", choices: ["Bonne énergie", "Fatigue légère", "Fatigue constante"], key: "energie" },
  { id: "Q7", type: "choice", text: "Avez-vous pris du poids sans changer votre alimentation ?", choices: ["Non, poids stable", "Légère prise", "Prise importante"], key: "poids" },
  { id: "Q8", type: "choice", text: "Ressentez-vous souvent le froid (mains/pieds froids) ?", choices: ["Non", "Parfois", "Souvent"], key: "froid" },
  { id: "Q9", type: "choice", text: "Comment décririez-vous votre humeur ?", choices: ["Stable", "Fluctuante", "Moral bas"], key: "humeur" },
  { id: "Q10", type: "choice", text: "Votre sommeil est-il réparateur ?", choices: ["Oui, bon sommeil", "Parfois léger", "Difficultés"], key: "sommeil" },
  { id: "Q11", type: "choice", text: "Des changements peau ou cheveux ?", choices: ["Non", "Un peu secs", "Très secs/cassants"], key: "peau" },
  { id: "Q12", type: "choice", text: "Comment est votre transit intestinal ?", choices: ["Régulier", "Parfois lent", "Constipation"], key: "transit" },
  { id: "Q13", type: "choice", text: "Gonflement visage/mains le matin ?", choices: ["Non", "Parfois", "Oui, visible"], key: "gonflement" },
  { id: "Q14", type: "choice", text: "Difficultés de concentration ?", choices: ["Non", "Légères", "Brouillard mental"], key: "concentration" },
  { id: "Q15", type: "choice", text: "Changement de libido ?", choices: ["Aucun", "Variable", "Très basse"], key: "libido" },
  { id: "Q16", type: "open", text: "Merci {prenom}. Votre e-mail pour recevoir vos résultats ?", key: "email" }
];

// ============================================================================
// TRACKING ÉTAT DU QUIZ
// ============================================================================

function parseQuizState(messages) {
  const state = { step: -1, answers: {} };
  
  for (const msg of messages) {
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    
    // Extraire step depuis les réponses bot
    if (msg.role === "assistant") {
      try {
        const parsed = JSON.parse(content);
        if (typeof parsed.meta?.step === "number") {
          state.step = parsed.meta.step;
        }
        if (parsed.meta?.answers) {
          Object.assign(state.answers, parsed.meta.answers);
        }
      } catch {}
    }
    
    // Capturer réponses user
    if (msg.role === "user" && state.step >= 0 && state.step < QUIZ_FLOW.length) {
      const q = QUIZ_FLOW[state.step];
      if (q && q.key) {
        state.answers[q.key] = content.trim();
      }
    }
  }
  
  return state;
}

function getNextStep(currentStep, answers) {
  let next = currentStep + 1;
  
  // Sauter les questions conditionnelles non applicables
  while (next < QUIZ_FLOW.length) {
    const q = QUIZ_FLOW[next];
    if (q.condition && !q.condition(answers)) {
      next++;
    } else {
      break;
    }
  }
  
  return next;
}

function generateQuestion(step, answers) {
  if (step >= QUIZ_FLOW.length) return null;
  
  const q = QUIZ_FLOW[step];
  let text = q.text.replace(/{prenom}/g, answers.prenom || "");
  
  // Compter les questions principales pour le progress
  let mainCount = 0;
  for (let i = 0; i <= step; i++) {
    if (!QUIZ_FLOW[i].condition || QUIZ_FLOW[i].condition(answers)) {
      mainCount++;
    }
  }
  
  const response = {
    type: "question",
    text: text,
    meta: {
      mode: "A",
      step: step,
      answers: answers,
      progress: { enabled: true, current: mainCount, total: 16 }
    }
  };
  
  if (q.type === "choice" && q.choices) {
    response.choices = q.choices;
  }
  
  return response;
}

// ============================================================================
// RECHERCHE SERVEUR (pour Mode B)
// ============================================================================

function parseGelules() {
  const gelules = [];
  const blocks = DATA_COMPOSITIONS.split(/^-{50,}$/m);
  let cur = null;
  for (const block of blocks) {
    for (const line of block.trim().split('\n')) {
      const t = line.trim();
      if (t.match(/^(GÉLULE|CAPSULE)\s+/i)) {
        if (cur) gelules.push(cur);
        cur = { name: t.replace(/^(GÉLULE|CAPSULE)\s+/i, '').trim(), fullName: t, ingredients: [] };
      }
      if (cur && t.startsWith('•')) cur.ingredients.push(t.substring(1).trim());
    }
  }
  if (cur) gelules.push(cur);
  return gelules;
}

function parseCures() {
  const cures = [];
  const blocks = DATA_CURES.split(/(?=^\d+\.\s+CURE)/m);
  for (const block of blocks) {
    const m = block.match(/^\d+\.\s+(CURE\s+[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ0-9.+\s]+)/i);
    if (!m) continue;
    const cure = { name: m[1].trim(), composition: [], contraindications: [], url: "" };
    const urlM = block.match(/https:\/\/www\.suplemint\.com\/products\/[a-z0-9-]+/i);
    if (urlM) cure.url = urlM[0];
    const compM = block.match(/Composition[^:]*:([\s\S]*?)(?=Moment|Contre|Recomm|URL|$)/i);
    if (compM) {
      for (const l of compM[1].split('\n')) {
        const gm = l.match(/\d+x?\s*([A-Z0-9+®_\s]+)/i);
        if (gm) cure.composition.push(gm[1].trim().toUpperCase());
      }
    }
    const contraM = block.match(/Contre-indic[^:]*:([\s\S]*?)(?=Recomm|URL|Note|$)/i);
    if (contraM) cure.contraindications = contraM[1].split(/[,;•\n]/).map(s => s.trim().toLowerCase()).filter(s => s.length > 3);
    cures.push(cure);
  }
  return cures;
}

let _gelules = null, _cures = null;
function getGelules() { if (!_gelules) _gelules = parseGelules(); return _gelules; }
function getCures() { if (!_cures) _cures = parseCures(); return _cures; }

function searchCuresByIngredient(ing) {
  const term = ing.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const found = new Set();
  for (const g of getGelules()) {
    for (const i of g.ingredients) {
      if (i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)) {
        found.add(g.name.toUpperCase().replace(/[®+]/g, ''));
        break;
      }
    }
  }
  const results = [];
  for (const c of getCures()) {
    for (const comp of c.composition) {
      for (const gn of found) {
        if (comp.toUpperCase().includes(gn)) { results.push({ name: c.name, url: c.url }); break; }
      }
      if (results.find(r => r.name === c.name)) break;
    }
  }
  return results;
}

function searchGelulesByIngredient(ing) {
  const term = ing.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const results = [];
  for (const g of getGelules()) {
    for (const i of g.ingredients) {
      if (i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)) {
        results.push({ name: g.fullName, ingredient: i });
        break;
      }
    }
  }
  return results;
}

// ============================================================================
// PROMPTS LLM (SEULEMENT POUR RÉSULTATS ET MODE B)
// ============================================================================

const PROMPT_RESULTS = `Tu es Dr THYREN, expert en médecine fonctionnelle chez SUPLEMINT®.

GÉNÈRE LES RÉSULTATS en EXACTEMENT 7 BLOCS séparés par ===BLOCK===

BLOC 1: Analyse empathique (2-3 phrases, résumé des symptômes)
BLOC 2: Besoins fonctionnels en % (thyroïde, énergie, nerveux, transit, peau)
BLOC 3: CURE PRINCIPALE
  - Nom + URL depuis [CURES]
  - Mécanisme d'action avec VRAIS ingrédients/dosages depuis [COMPOSITIONS]
  - Bénéfices J+14 et J+90 (dates calculées)
  - Composition journalière
BLOC 4: CURE DE SOUTIEN (même format)
BLOC 5: Contre-indications si applicable
BLOC 6: "Nos nutritionnistes sont disponibles.\n[Prendre RDV](https://app.cowlendar.com/cal/67d2de1f5736e38664589693/54150414762252)"
BLOC 7: "Ce test est un outil de bien-être. Il ne remplace pas un avis médical."

JSON: {"type":"resultat","text":"BLOC1===BLOCK===BLOC2===BLOCK===...","meta":{"mode":"A"}}
Ton: Chaleureux, scientifique, vouvoiement, pas d'emojis.`;

const PROMPT_MODEB = `Tu es Dr THYREN. Réponds CONCIS (2-3 phrases).
Si [RÉSULTATS] fournis, utilise-les EXACTEMENT.
JSON: {"type":"reponse","text":"...","meta":{"mode":"B","progress":{"enabled":false}}}`;

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, conversationId } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "API key missing" });

    const lastUserMsg = messages.filter(m => m.role === "user").pop()?.content || "";
    const userText = typeof lastUserMsg === "object" ? lastUserMsg.text || "" : String(lastUserMsg);

    // ════════════════════════════════════════════════════════════════════════
    // DÉTECTION MODE QUIZ
    // ════════════════════════════════════════════════════════════════════════
    
    let isQuiz = userText.toLowerCase().match(/quiz|cure ideale|trouver ma cure/);
    for (const msg of messages) {
      if (msg.role === "assistant") {
        try {
          const p = JSON.parse(typeof msg.content === "string" ? msg.content : "{}");
          if (p?.meta?.mode === "A" || typeof p?.meta?.step === "number") { isQuiz = true; break; }
        } catch {}
      }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODE A: QUIZ
    // ════════════════════════════════════════════════════════════════════════
    
    if (isQuiz) {
      const state = parseQuizState(messages);
      console.log(`📋 Quiz: step=${state.step}, answers=${JSON.stringify(state.answers)}`);
      
      // Déterminer le prochain step
      let nextStep;
      if (state.step < 0) {
        // Premier message = démarrage quiz
        nextStep = 0;
      } else {
        // Capturer la réponse actuelle
        const currentQ = QUIZ_FLOW[state.step];
        if (currentQ && currentQ.key) {
          state.answers[currentQ.key] = userText.trim();
        }
        nextStep = getNextStep(state.step, state.answers);
      }
      
      console.log(`📋 Next step: ${nextStep}`);
      
      // ════════════════════════════════════════════════════════════════════
      // FIN DU QUIZ → GÉNÉRER RÉSULTATS (appel LLM)
      // ════════════════════════════════════════════════════════════════════
      
      if (nextStep >= QUIZ_FLOW.length) {
        console.log("🎯 Generating results...");
        
        const today = new Date();
        const fmt = d => `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
        const j14 = new Date(today.getTime() + 14*86400000);
        const j90 = new Date(today.getTime() + 90*86400000);
        
        const userData = `UTILISATEUR:
Prénom: ${state.answers.prenom || "?"}
Sexe: ${state.answers.sexe || "?"}
Âge: ${state.answers.age || "?"}
Condition: ${state.answers.condition || "RAS"} ${state.answers.condition_detail || ""}
Plainte: ${state.answers.plainte || "?"}
Durée: ${state.answers.duree || "?"}
Impact: ${state.answers.impact || "?"}
Énergie: ${state.answers.energie || "?"}
Poids: ${state.answers.poids || "?"}
Froid: ${state.answers.froid || "?"}
Humeur: ${state.answers.humeur || "?"}
Sommeil: ${state.answers.sommeil || "?"}
Peau: ${state.answers.peau || "?"}
Transit: ${state.answers.transit || "?"}
Gonflement: ${state.answers.gonflement || "?"}
Concentration: ${state.answers.concentration || "?"}
Libido: ${state.answers.libido || "?"}
Email: ${state.answers.email || "?"}

DATES: Aujourd'hui=${fmt(today)}, J+14=${fmt(j14)}, J+90=${fmt(j90)}`;

        const llmMessages = [
          { role: "system", content: PROMPT_RESULTS },
          { role: "system", content: `${userData}\n\n[CURES]:\n${DATA_CURES}\n\n[COMPOSITIONS]:\n${DATA_COMPOSITIONS}` },
          { role: "user", content: "Génère les 7 blocs de résultats." }
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "gpt-5-mini", messages: llmMessages, response_format: { type: "json_object" }, temperature: 0.3, max_tokens: 3500 })
        });

        if (!response.ok) {
          console.error("❌ OpenAI error:", await response.text());
          return res.status(500).json({ error: "OpenAI error" });
        }

        const data = await response.json();
        let reply;
        try { reply = JSON.parse(data.choices?.[0]?.message?.content || "{}"); }
        catch { reply = { type: "resultat", text: "Erreur génération résultats.", meta: { mode: "A" } }; }
        
        return res.status(200).json({ reply, conversationId, mode: "A" });
      }
      
      // ════════════════════════════════════════════════════════════════════
      // QUESTION → GÉNÉRATION SERVEUR DIRECT (PAS DE LLM!)
      // ════════════════════════════════════════════════════════════════════
      
      const questionReply = generateQuestion(nextStep, state.answers);
      if (questionReply) {
        console.log(`✅ Question ${nextStep} generated (NO LLM)`);
        return res.status(200).json({ reply: questionReply, conversationId, mode: "A" });
      }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODE B: QUESTIONS LIBRES
    // ════════════════════════════════════════════════════════════════════════
    
    console.log("🔍 Mode B");
    
    let search = "";
    let match = userText.toLowerCase().match(/cure.*(?:contien|avec)\s+(?:de\s+)?([a-z]+)/i);
    if (match) {
      const r = searchCuresByIngredient(match[1]);
      search = `[RÉSULTATS] Cures avec "${match[1]}": ${r.length}\n${r.map((x,i)=>`${i+1}. ${x.name}`).join("\n")}\n→ Liste ces ${r.length} cures EXACTEMENT.`;
    }
    match = userText.toLowerCase().match(/g[ée]lule.*(?:contien|avec)\s+(?:de\s+)?([a-z]+)/i);
    if (match) {
      const r = searchGelulesByIngredient(match[1]);
      search = `[RÉSULTATS] Gélules avec "${match[1]}": ${r.length}\n${r.map((x,i)=>`${i+1}. ${x.name} → ${x.ingredient}`).join("\n")}\n→ Liste ces ${r.length} gélules EXACTEMENT.`;
    }

    const llmMessages = [
      { role: "system", content: PROMPT_MODEB },
      { role: "system", content: `${search}\n[CURES]:${DATA_CURES.substring(0,15000)}\n[COMPOSITIONS]:${DATA_COMPOSITIONS.substring(0,15000)}\n[SAV]:${DATA_SAV}` },
      ...messages.slice(-5).map(m => ({ role: m.role, content: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }))
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: llmMessages, response_format: { type: "json_object" }, temperature: 0.2, max_tokens: 1500 })
    });

    if (!response.ok) {
      console.error("❌ OpenAI error:", await response.text());
      return res.status(500).json({ error: "OpenAI error" });
    }

    const data = await response.json();
    let reply;
    try { reply = JSON.parse(data.choices?.[0]?.message?.content || "{}"); }
    catch { reply = { type: "reponse", text: "Erreur.", meta: { mode: "B", progress: { enabled: false } } }; }

    return res.status(200).json({ reply, conversationId, mode: "B" });

  } catch (err) {
    console.error("❌ Error:", err);
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
