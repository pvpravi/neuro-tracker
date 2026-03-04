import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssessmentQuestions } from "./AssessmentQuestions";
import { assessmentQuestionsByAge, DOMAINS, getDomainDisplayName } from "@/lib/assessment-data";

type LocalizedText = {
  text_en: string;
  text_hi: string;
  text_te: string;
  text_ta: string;
  text_kn: string;
  text_ml: string;
  text_or: string;
  text_bn: string;
  text_ur: string;
};

type NarrativeQuestion = {
  id: string;
  domain: string;
} & LocalizedText;

type RatingQuestion = {
  id: string;
  domain: string;
} & LocalizedText;

// Narrative, open-ended questions by age group & domain
const ageChanneledQuestions: Record<"0-3" | "4-6" | "7+", NarrativeQuestion[]> = {
  "0-3": [
    {
      id: "sensory_0_1",
      domain: "Sensory Processing",
      text_en:
        "How does your child react to different textures (grass, sand, clothing tags) and everyday sounds (vacuum, blender, traffic)?",
      text_hi:
        "आपका बच्चा अलग-अलग बनावटों (घास, रेत, कपड़ों के टैग) और रोज़मर्रा की आवाज़ों (वैक्यूम, ब्लेंडर, ट्रैफिक) पर कैसे प्रतिक्रिया देता है?",
      text_te:
        "మీ బిడ్డ వివిధ స్పర్శల (గడ్డి, ఇసుక, దుస్తుల ట్యాగ్లు) మరియు రోజువారీ శబ్దాలకు (వాక్యూమ్, బ్లెండర్, ట్రాఫిక్) ఎలా స్పందిస్తారు?",
      text_ta:
        "உங்கள் குழந்தை பல்வேறு மேற்பரப்புகள் (புல், மணல், உடை லேபிள்கள்) மற்றும் அன்றாட ஒலிகள் (வாக்யூம், பிளெண்டர், ட்ராஃபிக்) மீது எப்படி பதிலளிக்கிறார்?",
      text_kn:
        "ನಿಮ್ಮ ಮಗು ವಿಭಿನ್ನ ಸ್ಪರ್ಶಗಳು (ಹುಲ್ಲು, ಮಣ್ಣು, ಬಟ್ಟೆಯ ಟ್ಯಾಗ್‌ಗಳು) ಮತ್ತು ದೈನಂದಿನ ಶಬ್ದಗಳಿಗೆ (ವ್ಯಾಕ್ಯೂಮ್, ಬ್ಲೆಂಡರ್, ಟ್ರಾಫಿಕ್) ಹೇಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ?",
      text_ml:
        "വ്യത്യസ്തമായ ഉപരിതലങ്ങൾക്കും (പുല്ല്, മണൽ, വസ്ത്ര ടാഗുകൾ) ദിവസേനയുള്ള ശബ്ദങ്ങൾക്കും (വാക്യൂം, ബ്ലെൻഡർ, ട്രാഫിക്) നിങ്ങളുടെ കുഞ്ഞ് എങ്ങനെ പ്രതികരിക്കുന്നു?",
      text_or:
        "ଆପଣଙ୍କ ଶିଶୁ ବିଭିନ୍ନ ସ୍ପର୍ଶ (ଘାସ, ବାଲୁକା, କପଡ଼ ଟ୍ୟାଗ୍) ଏବଂ ପ୍ରତିଦିନୀୟ ଶବ୍ଦ (ଭ୍ୟାକ୍ୟୁମ୍, ବ୍ଲେଣ୍ଡର୍, ଟ୍ରାଫିକ୍) ପ୍ରତି କିପରି ପ୍ରତିକ୍ରିୟା କରେ?",
      text_bn:
        "আপনার শিশু বিভিন্ন স্পর্শ (ঘাস, বালি, জামাকাপড়ের ট্যাগ) এবং দৈনন্দিন শব্দ (ভ্যাকুয়াম, ব্লেন্ডার, ট্রাফিক) এর প্রতি কীভাবে প্রতিক্রিয়া করে?",
      text_ur:
        "آپ کا بچہ مختلف سطحوں (گھاس، ریت، کپڑوں کے ٹیگز) اور روزمرہ کی آوازوں (ویکیوم، بلینڈر، ٹریفک) پر کیسے ردِعمل ظاہر کرتا ہے؟",
    },
    {
      id: "motor_0_1",
      domain: "Gross/Fine Motor",
      text_en:
        "Where are they currently with crawling/walking, and how do they use their hands (grasping toys, holding a spoon or cup)?",
      text_hi:
        "रेंगने/चलने में वे अभी कहाँ तक पहुँचे हैं, और वे अपने हाथों का कैसे उपयोग करते हैं (खिलौने पकड़ना, चम्मच या कप पकड़ना)?",
      text_te:
        "వారు ప్రస్తుతం తొంగడం/నడకలో ఎక్కడ ఉన్నారు, మరియు చేతులను ఎలా ఉపయోగిస్తున్నారు (బొమ్మలు పట్టుకోవడం, స్పూన్ లేదా కప్పు పట్టుకోవడం)?",
      text_ta:
        "அவர்கள் இப்போது விரைவில் நகர்வது/நடப்பது எந்த நிலையில் உள்ளது, மற்றும் கைகளை (பொம்மைகள் பிடித்தல், கரண்டி அல்லது கோப்பை பிடித்தல்) எப்படி பயன்படுத்துகிறார்கள்?",
      text_kn:
        "ಅವರು ಈಗ ತುಳುಕು/ನಡೆಯುವಿಕೆಯಲ್ಲಿ ಎಲ್ಲಿ ಇದ್ದಾರೆ, ಮತ್ತು ಕೈಗಳನ್ನು ಹೇಗೆ ಬಳಸುತ್ತಾರೆ (ಆಟಿಕೆಗಳನ್ನು ಹಿಡಿಯುವುದು, ಚಮಚ ಅಥವಾ ಕಪ್ ಹಿಡಿಯುವುದು)?",
      text_ml:
        "ഇപ്പോൾ അവർ ഇഴയൽ/നടത്തം എന്നിവയിൽ എവിടെയാണ്, കൂടാതെ അവർ കൈകൾ ഉപയോഗിക്കുന്നത് എങ്ങനെയാണ് (കളിപ്പാട്ടങ്ങൾ പിടിക്കുക, സ്പൂൺ അല്ലെങ്കിൽ ഗ്ലാസ് പിടിക്കുക)?",
      text_or:
        "ସେମାନେ ବର୍ତ୍ତମାନ ହେଁଗୁଡ଼ିବା/ଚାଲିବାରେ କେଉଁ ଅବସ୍ଥାରେ ଅଛନ୍ତି, ଏବଂ ସେମାନେ ହାତକୁ କିପରି ବ୍ୟବହାର କରନ୍ତି (ଖେଳନା ଧରିବା, ଚମଚ କିମ୍ବା କପ୍ ଧରିବା)?",
      text_bn:
        "তারা এখন হামাগুড়ি দেওয়া/হাঁটার ক্ষেত্রে কোথায় আছে, এবং তারা হাত কীভাবে ব্যবহার করে (খেলনা ধরা, চামচ বা কাপ ধরা)?",
      text_ur:
        "وہ اس وقت رینگنے/چلنے میں کہاں تک پہنچے ہیں، اور وہ اپنے ہاتھوں کو کیسے استعمال کرتے ہیں (کھلونے پکڑنا، چمچ یا کپ پکڑنا)؟",
    },
    {
      id: "expressive_0_1",
      domain: "Expressive Communication",
      text_en:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_hi:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_te:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_ta:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_kn:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_ml:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_or:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_bn:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
      text_ur:
        "How does your child currently let you know what they want or need (sounds, gestures, pointing, words, AAC)?",
    },
    {
      id: "receptive_0_1",
      domain: "Receptive Language",
      text_en:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_hi:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_te:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_ta:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_kn:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_ml:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_or:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_bn:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
      text_ur:
        'How do they respond when you call their name or give simple directions like "come here" or "give me the ball"?',
    },
    {
      id: "social_0_1",
      domain: "Social/Emotional",
      text_en:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_hi:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_te:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_ta:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_kn:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_ml:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_or:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_bn:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
      text_ur:
        "When they are upset or excited, how do they usually seek comfort or connection (from you, siblings, familiar adults)?",
    },
    {
      id: "cognitive_0_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_hi:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_te:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_ta:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_kn:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_ml:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_or:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_bn:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
      text_ur:
        "Describe how they explore and play (e.g., repeating favorite actions, focusing on parts of toys, shifting between activities).",
    },
    {
      id: "education_0_1",
      domain: "Educational Profile",
      text_en:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_hi:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_te:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_ta:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_kn:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_ml:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_or:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_bn:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
      text_ur:
        "If they attend daycare/early intervention, how do they handle group routines and transitions with caregivers?",
    },
    {
      id: "diet_0_1",
      domain: "Dietary/Feeding",
      text_en:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_hi:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_te:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_ta:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_kn:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_ml:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_or:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_bn:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
      text_ur:
        "Are there any feeding concerns (difficulty chewing/swallowing, gagging, strong preferences for purees vs. solids, limited safe foods)?",
    }
  ],
  "4-6": [
    {
      id: "sensory_4_1",
      domain: "Sensory Processing",
      text_en:
        "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_hi: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_te:
        "సూపర్‌మార్కెట్‌లు, పుట్టినరోజు వేడుకలు, స్కూల్ అసెంబ్లీలు లాంటి శబ్దంగా లేదా గందరగోళంగా ఉండే చోట్ల వారు ఎలా మేనేజ్ చేస్తారు?",
      text_ta: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_kn: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_ml: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_or: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_bn: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
      text_ur: "How do they handle busy or noisy environments like supermarkets, birthday parties, or school assemblies?",
    },
    {
      id: "motor_4_1",
      domain: "Gross/Fine Motor",
      text_en:
        "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_hi: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_te:
        "జిప్‌లు, బటన్లు, షూస్ వేసుకోవడం వంటి దుస్తుల పనులను, అలాగే క్రేయాన్లు, కత్తెరలు లేదా చిన్న బొమ్మలతో చేసే సూక్ష్మ కదలికల పనులను వారు ఎలా నిర్వహిస్తారు?",
      text_ta: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_kn: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_ml: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_or: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_bn: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
      text_ur: "How do they manage dressing tasks (zippers, buttons, shoes) and fine motor tasks like using crayons, scissors, or small toys?",
    },
    {
      id: "expressive_4_1",
      domain: "Expressive Communication",
      text_en:
        "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_hi: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_te:
        "తమ ఆలోచనలు, భావాలను సాధారణంగా ఎలా వ్యక్తపరుస్తారు (మాటల ద్వారా, చేతి సంకేతాలతో, AAC ద్వారా, డైలాగ్‌లను రిపీట్ చేయడం, ఆటలో చూపించడం మొదలైనవి)?",
      text_ta: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_kn: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_ml: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_or: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_bn: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
      text_ur: "How do they usually express their ideas and feelings (spoken language, gestures, AAC, scripts, play)?",
    },
    {
      id: "receptive_4_1",
      domain: "Receptive Language",
      text_en:
        'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_hi: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_te:
        'ఇంటి దగ్గర లేదా స్కూల్‌లో గ్రూప్ ఇన్స్ట్రక్షన్స్ లేదా అనేక స్టెప్పులు ఉన్న సూచనలకు (ఉదా: "నీ షూస్ వేసుకో, తర్వాత బ్యాక్‌ప్యాక్ తీసుకో") వారు ఎలా స్పందిస్తారు?',
      text_ta: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_kn: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_ml: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_or: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_bn: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
      text_ur: 'How do they respond to group instructions or multi-step directions at home or school (e.g., "put your shoes on and get your backpack")?',
    },
    {
      id: "social_4_1",
      domain: "Social/Emotional",
      text_en:
        "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_hi: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_te:
        "తమకు ఇష్టమైన పని నుంచి ఇష్టం లేని పనికి మారేటప్పుడు వారు ఎలా రియాక్ట్ అవుతారు, మరియు ఒత్తిడిగా లేదా బాధగా అనిపించినప్పుడు వారికి ఏమి సాయం చేస్తుంది?",
      text_ta: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_kn: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_ml: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_or: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_bn: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
      text_ur: "How do they handle transitions between preferred and non‑preferred activities, and what helps when they feel overwhelmed or upset?",
    },
    {
      id: "cognitive_4_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_hi: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_te:
        "రోజువారీ రొటీన్‌లను వారు ఎలా కొనసాగిస్తారు, సింపుల్ పనులను పూర్తి చేయడం, లేదా ఒక ఆట/పని నుండి మరొకదానికి దృష్టిని మార్చడం ఎలా జరుగుతోంది?",
      text_ta: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_kn: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_ml: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_or: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_bn: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
      text_ur: "How do they manage routines, follow-through on simple tasks, or shift attention between activities or play ideas?",
    },
    {
      id: "education_4_1",
      domain: "Educational Profile",
      text_en:
        "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_hi: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_te:
        "ప్రస్తుతం వారు ఉండే స్కూల్/థెరపీ సెట్‌అప్ ఎలా ఉంది, క్లాస్‌రూమ్ రొటీన్‌లను వారు ఎంత వరకు పాటిస్తారు, మరియు తోటి పిల్లలతో, టీచర్లతో ఎలా ఇంటరాక్ట్ అవుతున్నారు?",
      text_ta: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_kn: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_ml: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_or: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_bn: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
      text_ur: "Describe their current school/therapy setting, how they follow classroom routines, and how they relate to peers and staff.",
    },
    {
      id: "diet_4_1",
      domain: "Dietary/Feeding",
      text_en:
        "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_hi: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_te:
        "వారికి చాలా ఇష్టమైన ఆహారాలు, 'సేఫ్ ఫుడ్స్', అలాగే బలమైన సెన్సరీ అవర్షన్స్ (క్రంచీ vs. సాఫ్ట్, మిక్స్‌డ్ టెక్చర్లు, చల్లగా/వేడి, GFCF లేదా ఇతర డైట్స్) ఏవో వివరంగా రాయండి.",
      text_ta: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_kn: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_ml: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_or: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_bn: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
      text_ur: "List any strong food preferences, safe foods, or sensory aversions (crunchy vs. soft, mixed textures, temperature, GFCF or other diets).",
    }
  ],
  "7+": [
    {
      id: "sensory_7_1",
      domain: "Sensory Processing",
      text_en:
        "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_hi: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_te:
        "వారు కొన్ని ప్రత్యేకమైన సెన్సరీ అనుభవాలను (కదలిక, గట్టిగా హగ్‌లు, శబ్దం) ఎక్కువగా వెతుకుతారా? లేక గుంపులు, ప్రకాశవంతమైన లైట్లు, కొన్ని శబ్దాలను వీలైనంతవరకు తప్పించుకుంటారా?",
      text_ta: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_kn: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_ml: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_or: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_bn: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
      text_ur: "Do they tend to seek certain sensory input (movement, deep pressure, noise) or avoid it (crowds, bright lights, certain sounds)?",
    },
    {
      id: "motor_7_1",
      domain: "Gross/Fine Motor",
      text_en:
        "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_hi: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_te:
        "హ్యాండ్‌రైటింగ్, టైపింగ్, క్రీడలు లేదా పి.ఇ. యాక్టివిటీల్లాంటి పనులలో వారి స్టామినా ఎలా ఉంది? ఈ రకమైన శరీర కదలికల పనులతో వారు త్వరగా అలసిపోతారా?",
      text_ta: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_kn: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_ml: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_or: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_bn: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
      text_ur: "How is their stamina for handwriting, typing, sports, or PE activities, and do they tire easily with motor tasks?",
    },
    {
      id: "expressive_7_1",
      domain: "Expressive Communication",
      text_en:
        "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_hi: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_te:
        "నమ్మకమైన పెద్దవారితో మరియు తోటి పిల్లలతో వారు తమ ఆలోచనలు, అవసరాలు, లిమిట్స్/బౌండరీలను (మాటల ద్వారా, రాతలో లేదా AAC ద్వారా) ఎంత వరకు సౌకర్యంగా పంచుకోగలరు?",
      text_ta: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_kn: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_ml: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_or: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_bn: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
      text_ur: "How comfortable are they sharing their thoughts, needs, or boundaries with trusted adults and peers (in speech, writing, or AAC)?",
    },
    {
      id: "receptive_7_1",
      domain: "Receptive Language",
      text_en:
        "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_hi: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_te:
        "క్లాస్‌లో లేదా ఇంట్లో ఇన్స్ట్రక్షన్లు విన్నప్పుడు, ముఖ్యంగా సమాచారం పొడవుగా, వేగంగా లేదా కాస్త క్లిష్టంగా ఉన్నప్పుడు వారు ఎంత వరకు ఫాలో అవగలరు?",
      text_ta: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_kn: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_ml: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_or: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_bn: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
      text_ur: "How do they manage listening to instructions in class or at home, especially when information is long, fast, or complex?",
    },
    {
      id: "social_7_1",
      domain: "Social/Emotional",
      text_en:
        "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_hi: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_te:
        "స్నేహాలు, గ్రూప్‌లో కలిసి పని చేయడం, లేదా గొడవల సమయంలో వారు ఎలా మేనేజ్ చేస్తారు? భావోద్వేగంగా సేఫ్‌గా, అర్థం చేసుకున్నట్టు అనిపించేందుకు ఏమి సహాయపడుతుంది?",
      text_ta: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_kn: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_ml: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_or: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_bn: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
      text_ur: "How do they navigate friendships, group work, and conflict, and what helps them feel emotionally safe and understood?",
    },
    {
      id: "cognitive_7_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_hi: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_te:
        "ప్లానింగ్, స్కూల్ వర్క్‌ను ఆర్గనైజ్ చేయడం, సమయాన్ని మేనేజ్ చేయడం, ఒక పని/విషయం నుంచి ఇంకొకదానికి మారడం వంటి విషయాలను వారు ఎలా హ్యాండిల్ చేస్తారు?",
      text_ta: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_kn: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_ml: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_or: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_bn: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
      text_ur: "How do they handle planning, organizing schoolwork, managing time, and shifting between tasks or topics?",
    },
    {
      id: "education_7_1",
      domain: "Educational Profile",
      text_en:
        "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_hi: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_te:
        "వారి ఇష్టమైన లెర్నింగ్ స్టైలు (విజువల్, వినడం, చేతితో చేసి నేర్చుకోవడం మొదలైనవి), ప్రస్తుత IEP/లెర్నింగ్ గోల్స్, అలాగే హోమ్‌వర్క్‌లో ఎదుర్కొనే కష్టాల గురించి మీకు తెలిసినదాన్ని వివరించండి.",
      text_ta: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_kn: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_ml: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_or: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_bn: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
      text_ur: "What do you know about their preferred learning style (visual, verbal, hands‑on), current IEP/learning goals, and homework challenges?",
    },
    {
      id: "diet_7_1",
      domain: "Dietary/Feeding",
      text_en:
        "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_hi: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_te:
        "స్నాక్స్/మీల్‌ల విషయంలో వారు ఎంతవరకు స్వతంత్రంగా ఉంటారు? సెన్సరీ ప్రిఫరెన్స్‌లు లేదా ఆహారం పట్ల ఉన్న ఆందోళన వల్ల ఎలాంటి పోషక లోటు లేదా ఆహార పరిమితులు కనిపిస్తున్నాయా?",
      text_ta: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_kn: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_ml: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_or: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_bn: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
      text_ur: "How independent are they with snacks/meals, and are there any nutritional gaps or restrictions due to sensory preferences or anxiety around food?",
    }
  ]
};

// 1–5 rating questions by age group & domain
const ratingQuestionsByAge: Record<"0-3" | "4-6" | "7+", RatingQuestion[]> = {
  "0-3": [
    {
      id: "sensory_rating_0_1",
      domain: "Sensory Processing",
      text_en:
        "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_hi: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_te: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_ta: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_kn: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_ml: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_or: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_bn: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
      text_ur: "On a scale of 1–5, how challenging are everyday sensory experiences for your child (textures, sounds, movement)?",
    },
    {
      id: "motor_rating_0_1",
      domain: "Gross/Fine Motor",
      text_en:
        "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_hi: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_te: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_ta: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_kn: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_ml: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_or: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_bn: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
      text_ur: "On a scale of 1–5, how confident do you feel about your child's current motor skills (crawling/walking, grasping, self‑feeding)?",
    },
    {
      id: "expressive_rating_0_1",
      domain: "Expressive Communication",
      text_en:
        "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_hi: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_te: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_ta: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_kn: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_ml: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_or: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_bn: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
      text_ur: "On a scale of 1–5, how well can your child currently express their wants and needs in a way that others understand?",
    },
    {
      id: "receptive_rating_0_1",
      domain: "Receptive Language",
      text_en:
        "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_hi: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_te: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_ta: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_kn: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_ml: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_or: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_bn: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
      text_ur: "On a scale of 1–5, how easily does your child seem to understand everyday words, directions, and routines?",
    },
    {
      id: "social_rating_0_1",
      domain: "Social/Emotional",
      text_en:
        "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_hi: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_te: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_ta: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_kn: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_ml: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_or: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_bn: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
      text_ur: "On a scale of 1–5, how settled or regulated do they usually seem with familiar people during the day?",
    },
    {
      id: "cognitive_rating_0_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_hi: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_te: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_ta: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_kn: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_ml: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_or: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_bn: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
      text_ur: "On a scale of 1–5, how smoothly do they explore, shift between toys/activities, and stay with something they enjoy?",
    },
    {
      id: "education_rating_0_1",
      domain: "Educational Profile",
      text_en:
        "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_hi: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_te: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_ta: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_kn: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_ml: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_or: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_bn: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
      text_ur: "On a scale of 1–5, how comfortable do they seem in early learning or group‑care settings (if applicable)?",
    },
    {
      id: "diet_rating_0_1",
      domain: "Dietary/Feeding",
      text_en:
        "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_hi: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_te: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_ta: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_kn: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_ml: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_or: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_bn: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
      text_ur: "On a scale of 1–5, how easy or hard are mealtimes and feeding (variety, safety, stress level)?",
    }
  ],
  "4-6": [
    {
      id: "sensory_rating_4_1",
      domain: "Sensory Processing",
      text_en:
        "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_hi: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_te: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_ta: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_kn: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_ml: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_or: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_bn: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
      text_ur: "On a scale of 1–5, how challenging are busy or noisy places (classrooms, parties, shops) for your child?",
    },
    {
      id: "motor_rating_4_1",
      domain: "Gross/Fine Motor",
      text_en:
        "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_hi: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_te: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_ta: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_kn: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_ml: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_or: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_bn: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
      text_ur: "On a scale of 1–5, how confident do you feel about their gross/fine motor skills for everyday tasks (dressing, drawing, playground)?",
    },
    {
      id: "expressive_rating_4_1",
      domain: "Expressive Communication",
      text_en:
        "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_hi: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_te: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_ta: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_kn: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_ml: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_or: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_bn: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
      text_ur: "On a scale of 1–5, how easily can they share what they think, feel, and need with trusted adults?",
    },
    {
      id: "receptive_rating_4_1",
      domain: "Receptive Language",
      text_en:
        "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_hi: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_te: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_ta: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_kn: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_ml: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_or: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_bn: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
      text_ur: "On a scale of 1–5, how well do they follow everyday and classroom instructions without extra support?",
    },
    {
      id: "social_rating_4_1",
      domain: "Social/Emotional",
      text_en:
        "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_hi: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_te: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_ta: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_kn: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_ml: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_or: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_bn: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
      text_ur: "On a scale of 1–5, how smoothly do they move between activities and handle big feelings with support?",
    },
    {
      id: "cognitive_rating_4_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_hi: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_te: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_ta: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_kn: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_ml: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_or: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_bn: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
      text_ur: "On a scale of 1–5, how manageable are routines, staying on task, and shifting focus when needed?",
    },
    {
      id: "education_rating_4_1",
      domain: "Educational Profile",
      text_en:
        "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_hi: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_te: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_ta: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_kn: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_ml: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_or: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_bn: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
      text_ur: "On a scale of 1–5, how well is their current school/therapy environment meeting their needs?",
    },
    {
      id: "diet_rating_4_1",
      domain: "Dietary/Feeding",
      text_en:
        "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_hi: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_te: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_ta: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_kn: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_ml: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_or: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_bn: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
      text_ur: "On a scale of 1–5, how manageable are eating, trying new foods, and supporting their nutritional needs right now?",
    }
  ],
  "7+": [
    {
      id: "sensory_rating_7_1",
      domain: "Sensory Processing",
      text_en:
        "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_hi: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_te:
        "1 నుండి 5 వరకు స్కేల్‌లో చూసినప్పుడు, రోజువారీగా శబ్దం, గుంపులు, టెక్స్చర్‌లు వంటి సెన్సరీ అనుభవాలను వారు ఎంత వరకు మేనేజ్ చేయగలుగుతున్నారు?",
      text_ta: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_kn: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_ml: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_or: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_bn: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
      text_ur: "On a scale of 1–5, how manageable are sensory experiences (noise, crowds, textures) for your child day‑to‑day?",
    },
    {
      id: "motor_rating_7_1",
      domain: "Gross/Fine Motor",
      text_en:
        "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_hi: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_te:
        "1 నుండి 5 వరకు, హ్యాండ్‌రైటింగ్, టైపింగ్, ఆటలు/వర్క్ వంటి శరీర కదలికల పనులను వారు ఎంతకాలం ఎనర్జీ, కంఫర్ట్‌తో కొనసాగించగలిగితేనని మీకు అనిపిస్తోంది?",
      text_ta: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_kn: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_ml: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_or: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_bn: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
      text_ur: "On a scale of 1–5, how sustainable do handwriting, typing, and physical activities feel for them (energy, comfort)?",
    },
    {
      id: "expressive_rating_7_1",
      domain: "Expressive Communication",
      text_en:
        "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_hi: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_te:
        "1 నుండి 5 వరకు, తమ ఆలోచనలు, అవసరాలు, బౌండరీలను ఇతరులు అర్థం చేసుకునే విధంగా వారు ఎంత మంచిగా వ్యక్తపరచగలుగుతున్నారు?",
      text_ta: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_kn: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_ml: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_or: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_bn: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
      text_ur: "On a scale of 1–5, how well can they express their thoughts, needs, and boundaries in ways others understand?",
    },
    {
      id: "receptive_rating_7_1",
      domain: "Receptive Language",
      text_en:
        "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_hi: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_te:
        "1 నుండి 5 వరకు, సమాచారం కాస్త పొడవుగా లేదా క్లిష్టంగా ఉన్నప్పుడు కూడా మాట్లాడిన/రాసిన సూచనలను వారు ఫాలో అవడం ఎంత వరకు సాధ్యమవుతోంది?",
      text_ta: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_kn: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_ml: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_or: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_bn: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
      text_ur: "On a scale of 1–5, how manageable is it for them to follow spoken or written instructions, especially when information is complex?",
    },
    {
      id: "social_rating_7_1",
      domain: "Social/Emotional",
      text_en:
        "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_hi: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_te:
        "1 నుండి 5 వరకు, స్నేహాల్లో, గ్రూప్ యాక్టివిటీల్లో, అలాగే భావోద్వేగ ఆరోగ్య విషయంలో వారికి సరైన సపోర్ట్ ఉన్నట్టుగా మీకు ఎంతగా అనిపిస్తోంది?",
      text_ta: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_kn: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_ml: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_or: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_bn: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
      text_ur: "On a scale of 1–5, how supported do they seem in friendships, group work, and emotional wellbeing?",
    },
    {
      id: "cognitive_rating_7_1",
      domain: "Cognitive/Executive Function",
      text_en:
        "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_hi: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_te:
        "1 నుండి 5 వరకు, ప్లానింగ్ చేయడం, స్కూల్ పని లేదా రోజువారీ పనులను ఆర్గనైజ్ చేయడం, ట్రాక్‌లో ఉంచడం వంటి విషయాలు వారికి ఎంత వరకు మేనేజ్‌బుల్‌గా ఉన్నాయి?",
      text_ta: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_kn: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_ml: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_or: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_bn: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
      text_ur: "On a scale of 1–5, how manageable are planning, organizing, and keeping track of schoolwork or daily tasks?",
    },
    {
      id: "education_rating_7_1",
      domain: "Educational Profile",
      text_en:
        "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_hi: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_te:
        "1 నుండి 5 వరకు, ప్రస్తుత లెర్నింగ్ సపోర్ట్స్ (IEP, సపోర్ట్‌లు, టీచింగ్ స్టైల్) మీ బిడ్డ అవసరాలకు ఎంతవరకు సరిపోతున్నాయని మీరు భావిస్తున్నారు?",
      text_ta: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_kn: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_ml: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_or: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_bn: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
      text_ur: "On a scale of 1–5, how well do current learning supports (IEP, accommodations, teaching style) fit your child?",
    },
    {
      id: "diet_rating_7_1",
      domain: "Dietary/Feeding",
      text_en:
        "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_hi: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_te:
        "1 నుండి 5 వరకు, ప్రస్తుతం తినడం, ఆహారంలో వైవిధ్యం, స్నాక్స్/మీల్స్ విషయంలో వారి స్వతంత్రత – ఇవన్నీ ఎంత వరకు సులభంగా మేనేజ్ అవుతున్నాయని మీరు అనుకుంటున్నారు?",
      text_ta: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_kn: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_ml: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_or: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_bn: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
      text_ur: "On a scale of 1–5, how manageable are eating, nutritional variety, and independence with snacks/meals right now?",
    }
  ]
};

// Map age group to assessment data age group
function mapAgeGroup(ageGroup: "0-3" | "4-6" | "7+"): string {
  if (ageGroup === "0-3") return "0-3";
  if (ageGroup === "4-6") return "4-7";
  return "8-12"; // 7+ maps to 8-12 for the 40-question assessment
}

// Next.js 16: unwrap params Promise like in the child profile page
export default async function AssessmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const child = await prisma.child.findUnique({
    where: { id: params.id }
  });

  if (!child) {
    return <div className="p-8 text-center text-red-500">Child profile not found.</div>;
  }

  // Age bands: 2.5–4, 5–8, 9+ (using years)
  let ageGroup: "0-3" | "4-6" | "7+" = "4-6"; 
  if (child.age && child.age < 5) ageGroup = "0-3";      // 2.5–4 years
  if (child.age && child.age >= 9) ageGroup = "7+";      // 9+ years

  const questionsToAsk = ageChanneledQuestions[ageGroup];
  const ratingQuestions = ratingQuestionsByAge[ageGroup];
  const ratingByDomain = Object.fromEntries(
    ratingQuestions.map((q) => [q.domain, q] as const)
  );

  const groupedQuestions = questionsToAsk.reduce((acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = [];
    acc[q.domain].push(q);
    return acc;
  }, {} as Record<string, NarrativeQuestion[]>);

  // Get the 40 questions for the structured assessment
  const assessmentAgeGroup = mapAgeGroup(ageGroup);
  const structuredQuestions = assessmentQuestionsByAge[assessmentAgeGroup] || [];

  async function submitAssessment(formData: FormData) {
    "use server";
    
    const questionnaireData: Record<string, { text: string; answer: string }> = {};
    const answers: Record<number, number> = {};

    // Save the 1–5 ratings for each domain
    ratingQuestions.forEach((q) => {
      const raw = (formData.get(q.id) as string | null) || "";
      questionnaireData[q.id] = {
        text: q.text_en + " (1–5 caregiver rating)",
        answer: raw || "No rating provided",
      };
    });

    // Save narrative answers per question
    questionsToAsk.forEach((q) => {
      questionnaireData[q.id] = {
        text: q.text_en,
        answer: ((formData.get(q.id) as string) || "").trim() || "No answer provided",
      };
    });

    // Save the 40 structured assessment questions (0-4 scale)
    structuredQuestions.forEach((q) => {
      const value = parseInt((formData.get(`q_${q.id}`) as string) || "0", 10);
      answers[q.id] = value;
      questionnaireData[`structured_${q.id}`] = {
        text: q.text,
        answer: value.toString(),
      };
    });

    // Calculate domain scores
    const domainTotals: Record<string, { sum: number; count: number }> = {};
    structuredQuestions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (!domainTotals[q.domain]) domainTotals[q.domain] = { sum: 0, count: 0 };
        domainTotals[q.domain].sum += answers[q.id];
        domainTotals[q.domain].count += 1;
      }
    });

    const calculateScore = (domainKey: string): number => {
      const data = domainTotals[domainKey];
      if (!data || data.count === 0) return 0;
      // Max possible sum is 20 (5 questions × 4 points each)
      // Normalize to 0-10 scale
      return Number((data.sum / 2).toFixed(2));
    };

    await prisma.assessment.create({
      data: {
        childId: child!.id,
        ageGroup: assessmentAgeGroup,
        questionnaireData: JSON.stringify(questionnaireData),
        
        // 8 Core Domains (0-10 scale)
        patternLogicScore: calculateScore(DOMAINS.PATTERN_LOGIC),
        spatialConstructiveScore: calculateScore(DOMAINS.SPATIAL_CONSTRUCTIVE),
        sensoryRegulationScore: calculateScore(DOMAINS.SENSORY_REGULATION),
        repetitiveComfortScore: calculateScore(DOMAINS.REPETITIVE_COMFORT),
        taskPersistenceScore: calculateScore(DOMAINS.TASK_PERSISTENCE),
        verbalExpressiveScore: calculateScore(DOMAINS.VERBAL_EXPRESSIVE),
        transitionAdaptabilityScore: calculateScore(DOMAINS.TRANSITION_ADAPTABILITY),
        fineMotorScore: calculateScore(DOMAINS.FINE_MOTOR),
      }
    });

    // After saving the assessment, guide caregivers to the child profile
    redirect(`/dashboard/child/${child!.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Comprehensive Intake</h1>
          <p className="text-gray-600 text-lg">
            Building the clinical profile for <span className="font-semibold text-indigo-600">{child.name}</span> (Age Group: {ageGroup})
          </p>
        </div>

        <form action={submitAssessment} className="space-y-8">
          {/* Part 1: Narrative Questions with Ratings */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Part 1: Comprehensive Intake Questions</h2>
            <p className="text-sm text-blue-700 mb-6">
              These open-ended questions help us understand your child's daily experiences and challenges.
            </p>
            <AssessmentQuestions
              groups={Object.entries(groupedQuestions).map(([domain, questions]) => ({
                domain,
                rating: ratingByDomain[domain] || null,
                questions,
              }))}
            />
          </div>

          {/* Part 2: Structured 40-Question Assessment */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Part 2: Developmental Assessment (40 Questions)</h2>
            <p className="text-sm text-green-700 mb-6">
              Rate each statement on a scale of 0-4 based on how well it describes your child.
              <br />
              <span className="font-semibold">0 = Not at all</span> | <span className="font-semibold">1 = Rarely</span> | <span className="font-semibold">2 = Sometimes</span> | <span className="font-semibold">3 = Often</span> | <span className="font-semibold">4 = Always/Very Well</span>
            </p>
            
            {Object.entries(
              structuredQuestions.reduce((acc, q) => {
                const domainName = getDomainDisplayName(q.domain);
                if (!acc[domainName]) acc[domainName] = [];
                acc[domainName].push(q);
                return acc;
              }, {} as Record<string, typeof structuredQuestions>)
            ).map(([domainName, questions]) => (
              <div key={domainName} className="mb-8 bg-white p-6 rounded-lg border border-green-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{domainName}</h3>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {index + 1}. {q.text}
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[0, 1, 2, 3, 4].map((value) => (
                          <label
                            key={value}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 cursor-pointer hover:border-green-500 hover:bg-green-50"
                          >
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              value={value}
                              required
                              className="h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-lg"
            >
              Complete Assessment & View Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
