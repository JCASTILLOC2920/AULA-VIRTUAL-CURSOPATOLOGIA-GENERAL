import re

docx_text = """
SEMANA 1: Patologa celular y adaptacin
INFARTO DE MIOCARDIO
https://pathpresenter.net/public/display?token=248bbe59
DISPLASIA DE CERVIX
https://pathpresenter.net/public/display?token=d75fab19
ATROFIA TESTICULAR 3
https://pathpresenter.net/public/display?token=748f6bda
ATROFIA ENDOMETRIAL
https://pathpresenter.net/public/display?token=797344d4
METAPLASIA INTESTINAL ESOFAGO DE BARRETT
https://pathpresenter.net/public/display?token=584e4e83
INFARTO PULMONAR
https://pathpresenter.net/public/display?token=a6e7b009
ATROFIA TESTICULAR
https://pathpresenter.net/public/display?token=8e5eb3dd
ATROFIA TESTICULAR 1
https://pathpresenter.net/public/display?token=c1c5c9b4

SEMANA 2: Inflamacin aguda y crnica I
APENDICITIS AGUDA
https://pathpresenter.net/public/display?token=fa509f6d
TIROIDITIS HASHIMOTO
https://pathpresenter.net/public/display?token=f5d7ccdc
NECROSIS CASEOSA 2
https://pathpresenter.net/public/display?token=fac78530
NECROSIS CASEOSA 1
https://pathpresenter.net/public/display?token=8dcb6c25
APENDICITIS AGUDA SUPURADA
https://pathpresenter.net/public/display?token=b4cfc4e4
ABSCESO PULMONAR
https://pathpresenter.net/public/display?token=ab7d0ffd

REACCION A CUERPO EXTRAO
https://pathpresenter.net/public/display?token=ffa7d0dc

SEMANA 3: Inflamacin aguda y crnica II 
PIELONEFRITIS CRONICA
https://pathpresenter.net/public/display?token=9cbecd92
COLECISTITIS CRONICA CON COLESTEROLOSIS
https://pathpresenter.net/public/display?token=0948c37f
COLECITITIS CRONICA 2
https://pathpresenter.net/public/display?token=bb2e8bf6
VASCULITIS
https://pathpresenter.net/public/display?token=017c9aa6
ULCERA TIFICA
https://pathpresenter.net/public/display?token=2ad6b0e2
COLECISTITIS CRONICA 1
https://pathpresenter.net/public/display?token=dc913c5a 
PANICULITIS LOBULILLAR
https://pathpresenter.net/public/display?token=20611020

SEMANA 4:Trastornos metablico
CALCIFICACION PATOLOGICA
https://pathpresenter.net/public/display?token=24586d70
AMILOIDOSIS RENAL
https://pathpresenter.net/public/display?token=777fbbef
ARTERIOESCLEROSIS
https://pathpresenter.net/public/display?token=ce6e7ba8

SEMANA 5: Trastornos hemodinmicos
INFARTO ESPLENICO
https://pathpresenter.net/public/display?token=38e3ff65
HEMORRAGIA PULMONAR
https://pathpresenter.net/public/display?token=726dc325
CONG. PASIVA CRONICA HIGADO
https://pathpresenter.net/public/display?token=dc74a6bc
TROMBO EN ARTERIA CORONARIA
https://pathpresenter.net/public/display?token=936e7a3a
TROMBOSIS 1
https://pathpresenter.net/public/display?token=fd0da31d
EDEMA PULMONAR 1
https://pathpresenter.net/public/display?token=e031a2f6
EDEMA PULMONAR 2
https://pathpresenter.net/public/display?token=25bb3cc9
TROMBOSIS 2
https://pathpresenter.net/public/display?token=2be83a97
TROMBO OREJUELA AURICULAR
https://pathpresenter.net/public/display?token=af053a9c

SEMANA 6: Inmunopatologa. Rechazo de trasplantes.
RECHAZO RENAL CRNICO
https://pathpresenter.net/public/display?token=a57188d9
SJOGREN
https://pathpresenter.net/public/display?token=5af328c0
NEUMONIA INTERSTICIAL
https://pathpresenter.net/public/display?token=ac3a2996
GLOMERULONEFRITIS LUPICA 2
https://pathpresenter.net/public/display?token=337551be
PENFIGO VULGAR 2
https://pathpresenter.net/public/display?token=89dea610
glomerulonefritis lupica
https://pathpresenter.net/public/display?token=3d2aa6e9
PENFIGO VULGAR 1
https://pathpresenter.net/public/display?token=81215d1d
SEMANA 7: REPASO DE LMINAS
SEMANA 8: PRIMER EXAMEN PRCTICO
SEMANA 9: Neoplasias benignas.
ADENOMA DE COLON 1
https://pathpresenter.net/public/display?token=895fc764
ADENOMA DE COLON 3
https://pathpresenter.net/public/display?token=0b61172d
FIBROADENOMA MAMARIO
https://pathpresenter.net/public/display?token=7a6bef85
ADENOMA DE COLON 2
https://pathpresenter.net/public/display?token=7e78a87f
LEIOMIOMA 2
https://pathpresenter.net/public/display?token=10f4c5b9
LEIOMIOMA 1
https://pathpresenter.net/public/display?token=45ed22f5

SEMANA 10: Neoplasias malignas.
CARCINOMA DE PULMON 2
https://pathpresenter.net/public/display?token=6317dffb
ADENOCARCINOMA PULMONAR 1
https://pathpresenter.net/public/display?token=c08daa6d
CARCINOMA GASTRICO
https://pathpresenter.net/public/display?token=479c2163
CARCINOMA EPIDERMOIDE 2
https://pathpresenter.net/public/display?token=fec9c6e4
ADENOCARCINOMA GASTRICO
https://pathpresenter.net/public/display?token=36aff2a7
CARCINOMA DUCTAL DE MAMA
https://pathpresenter.net/public/display?token=06e2fb28
CARCINOMA EPIDERMOIDE 1
https://pathpresenter.net/public/display?token=25e9c3f7
CARCINOMA ESCAMOSO EN LENGUA
https://pathpresenter.net/public/display?token=102af0cc
CARCINOMA DUCTAL 40X
https://pathpresenter.net/public/display?token=917cceca

SEMANA 11: Neoplasias mesenquimales y linfoides.
TUMOR DE CELULAS GIGANTES-TENOSINOVIAL
https://pathpresenter.net/public/display?token=846c4031
SARCOMA
https://pathpresenter.net/public/display?token=a4ebb307
RABDOMIOMA
https://pathpresenter.net/public/display?token=55d5b56f
SARCOMA ALVEOLAR HE2
https://pathpresenter.net/public/display?token=4e5ac549
LINFOMA DE HODGKIN
https://pathpresenter.net/public/display?token=2e61c3f7
LINFOMA DE HODGKIN ESCLEROSIS NODULAR 2
https://pathpresenter.net/public/display?token=609b03ce
HODKING ESCLEROSIS NODULAR VARIANTE SINCITIAL40X
https://pathpresenter.net/public/display?token=0b80454e

SEMANA 12: Infecciones virales y bacterianas.
MENINGITIS PURULENTA
https://pathpresenter.net/public/display?token=dce3bcc4
TUBERCULOSIS MILIAR 2
https://pathpresenter.net/public/display?token=f6d877b0
NEUMONIA
https://pathpresenter.net/public/display?token=363eae18
lepra lepromatosa 2
https://pathpresenter.net/public/display?token=a36dc360
lepra lepromatosa 1
https://pathpresenter.net/public/display?token=f41578e5

SEMANA 13: Infecciones micticas y parasitarias.
STRONGYLOIDIASIS
https://pathpresenter.net/public/display?token=4797eadf
NEUMONIA EOSINOFILICA
https://pathpresenter.net/public/display?token=67b375df
CISTECERCOSIS
https://pathpresenter.net/public/display?token=ac251936
CROMOMICOSIS 
https://pathpresenter.net/public/display?token=4b0573b6
ASPERGILOSIS
https://pathpresenter.net/public/display?token=578bfaa7
TORULOSIS 1
https://pathpresenter.net/public/display?token=fb8beef1
QUISTE HIDATIDICO
https://pathpresenter.net/public/display?token=cb81c0fe
TORULOSIS 2
https://pathpresenter.net/public/display?token=f8ff345d
HIDATIDOSIS
https://pathpresenter.net/public/display?token=2e5e52ee
LEISHMANIASIS 1
https://pathpresenter.net/public/display?token=f4f35360
LEISHMANIASIS 2
https://pathpresenter.net/public/display?token=30b02492

SEMANA 14: Patologa ambiental. Enfermedades nutricionales.
TRICROMICA ESTEATOHEPATITIS 
https://pathpresenter.net/public/display?token=30ac7c2a
ATROFIA MUSCULAR
https://pathpresenter.net/public/display?token=0944089e
STEATONECROSIS
https://pathpresenter.net/public/display?token=6e72fe88
ESTEATOHEPATITIS RETICULINA
https://pathpresenter.net/public/display?token=35193038
ESTEATOHEPATITIS HE
https://pathpresenter.net/public/display?token=a276d6a3
ESTEATOSIS HEPATICA
https://pathpresenter.net/public/display?token=851c76fc
"""

import re
import json

lines = [l.strip() for l in docx_text.splitlines() if l.strip()]
mapping = {}
current_title = ""
for line in lines:
    if line.startswith("http"):
        mapping[current_title.upper()] = line
    elif not line.startswith("SEMANA"):
        current_title = line.strip()

with open('data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# We need to replace { type: "book", title: "...", ... } with added URL if missing
# Let's find all items.
def replacer(match):
    full_match = match.group(0)
    title = match.group(1).upper()
    title = title.replace("", "N") # fix encoding issues if any, or just ignore
    
    # Try fuzzy match if exact match fails
    matched_url = mapping.get(title)
    if not matched_url:
        for k, v in mapping.items():
            if title in k or k in title:
                matched_url = v
                break
            
            # Additional custom mappings based on typos
            if "HASHIMOTO" in title and "HASHIMOTO" in k:
                matched_url = v; break
            if "CASEOSO" in title and "CASEOSA 1" in k:
                matched_url = v; break
            if "CUERPO EXTRA" in title and "CUERPO EXTRA" in k:
                matched_url = v; break
            if "ABSCESO PULMONAR" in title and "ABSCESO PULMONAR" in k:
                matched_url = v; break
            if "APENDICITIS" in title and "APENDICITIS AGUDA" == k:
                matched_url = v; break
            if "CISTICERCOSIS" in title and "CISTECERCOSIS" in k:
                matched_url = v; break

    if matched_url:
        # If url already exists, replace it or skip?
        if 'url:' in full_match or '"url":' in full_match:
            # Let's just override it if it exists by regex, or add it
            # Actually, the user manually added some, but let's just make sure it's correct
            if 'url:' not in full_match and 'url :' not in full_match:
                # Add it before the closing brace
                return full_match.replace(' }', f', url: "{matched_url}" }}')
            else:
                # Replace existing URL (except the ones from youtube or other domains maybe?)
                if 'pathpresenter' in full_match:
                    full_match = re.sub(r'url:\s*"https://pathpresenter[^"]*"', f'url: "{matched_url}"', full_match)
                return full_match
    return full_match

new_content = re.sub(r'{\s*type:\s*"[^"]*",\s*title:\s*"([^"]+)"[^}]*}', replacer, data_content)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated data.js")
