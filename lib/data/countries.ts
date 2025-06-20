import type { Country, CountryDialCode } from "@/types";
export const COUNTRIES: Country[] = [
  { label: "🇦🇨 Ascension Island", value: "ascension-island", code: "ac" },
  { label: "🇦🇩 Andorra", value: "andorra", code: "ad" },
  {
    label: "🇦🇪 United Arab Emirates",
    value: "united-arab-emirates",
    code: "ae",
  },
  { label: "🇦🇫 Afghanistan", value: "afghanistan", code: "af" },
  { label: "🇦🇬 Antigua & Barbuda", value: "antigua-&-barbuda", code: "ag" },
  { label: "🇦🇮 Anguilla", value: "anguilla", code: "ai" },
  { label: "🇦🇱 Albania", value: "albania", code: "al" },
  { label: "🇦🇲 Armenia", value: "armenia", code: "am" },
  { label: "🇦🇴 Angola", value: "angola", code: "ao" },
  { label: "🇦🇶 Antarctica", value: "antarctica", code: "aq" },
  { label: "🇦🇷 Argentina", value: "argentina", code: "ar" },
  { label: "🇦🇸 American Samoa", value: "american-samoa", code: "as" },
  { label: "🇦🇹 Austria", value: "austria", code: "at" },
  { label: "🇦🇺 Australia", value: "australia", code: "au" },
  { label: "🇦🇼 Aruba", value: "aruba", code: "aw" },
  { label: "🇦🇽 Åland Islands", value: "åland-islands", code: "ax" },
  { label: "🇦🇿 Azerbaijan", value: "azerbaijan", code: "az" },
  {
    label: "🇧🇦 Bosnia & Herzegovina",
    value: "bosnia-&-herzegovina",
    code: "ba",
  },
  { label: "🇧🇧 Barbados", value: "barbados", code: "bb" },
  { label: "🇧🇩 Bangladesh", value: "bangladesh", code: "bd" },
  { label: "🇧🇪 Belgium", value: "belgium", code: "be" },
  { label: "🇧🇫 Burkina Faso", value: "burkina-faso", code: "bf" },
  { label: "🇧🇬 Bulgaria", value: "bulgaria", code: "bg" },
  { label: "🇧🇭 Bahrain", value: "bahrain", code: "bh" },
  { label: "🇧🇮 Burundi", value: "burundi", code: "bi" },
  { label: "🇧🇯 Benin", value: "benin", code: "bj" },
  { label: "🇧🇱 St. Barthélemy", value: "st.-barthélemy", code: "bl" },
  { label: "🇧🇲 Bermuda", value: "bermuda", code: "bm" },
  { label: "🇧🇳 Brunei", value: "brunei", code: "bn" },
  { label: "🇧🇴 Bolivia", value: "bolivia", code: "bo" },
  {
    label: "🇧🇶 Caribbean Netherlands",
    value: "caribbean-netherlands",
    code: "bq",
  },
  { label: "🇧🇷 Brazil", value: "brazil", code: "br" },
  { label: "🇧🇸 Bahamas", value: "bahamas", code: "bs" },
  { label: "🇧🇹 Bhutan", value: "bhutan", code: "bt" },
  { label: "🇧🇻 Bouvet Island", value: "bouvet-island", code: "bv" },
  { label: "🇧🇼 Botswana", value: "botswana", code: "bw" },
  { label: "🇧🇾 Belarus", value: "belarus", code: "by" },
  { label: "🇧🇿 Belize", value: "belize", code: "bz" },
  { label: "🇨🇦 Canada", value: "canada", code: "ca" },
  {
    label: "🇨🇨 Cocos (Keeling) Islands",
    value: "cocos-(keeling)-islands",
    code: "cc",
  },
  { label: "🇨🇩 Congo - Kinshasa", value: "congo---kinshasa", code: "cd" },
  {
    label: "🇨🇫 Central African Republic",
    value: "central-african-republic",
    code: "cf",
  },
  { label: "🇨🇬 Congo - Brazzaville", value: "congo---brazzaville", code: "cg" },
  { label: "🇨🇭 Switzerland", value: "switzerland", code: "ch" },
  { label: "🇨🇮 Côte d’Ivoire", value: "côte-d’ivoire", code: "ci" },
  { label: "🇨🇰 Cook Islands", value: "cook-islands", code: "ck" },
  { label: "🇨🇱 Chile", value: "chile", code: "cl" },
  { label: "🇨🇲 Cameroon", value: "cameroon", code: "cm" },
  { label: "🇨🇳 China", value: "china", code: "cn" },
  { label: "🇨🇴 Colombia", value: "colombia", code: "co" },
  { label: "🇨🇵 Clipperton Island", value: "clipperton-island", code: "cp" },
  { label: "🇨🇷 Costa Rica", value: "costa-rica", code: "cr" },
  { label: "🇨🇺 Cuba", value: "cuba", code: "cu" },
  { label: "🇨🇻 Cape Verde", value: "cape-verde", code: "cv" },
  { label: "🇨🇼 Curaçao", value: "curaçao", code: "cw" },
  { label: "🇨🇽 Christmas Island", value: "christmas-island", code: "cx" },
  { label: "🇨🇾 Cyprus", value: "cyprus", code: "cy" },
  { label: "🇨🇿 Czechia", value: "czechia", code: "cz" },
  { label: "🇩🇪 Germany", value: "germany", code: "de" },
  { label: "🇩🇬 Diego Garcia", value: "diego-garcia", code: "dg" },
  { label: "🇩🇯 Djibouti", value: "djibouti", code: "dj" },
  { label: "🇩🇰 Denmark", value: "denmark", code: "dk" },
  { label: "🇩🇲 Dominica", value: "dominica", code: "dm" },
  { label: "🇩🇴 Dominican Republic", value: "dominican-republic", code: "do" },
  { label: "🇩🇿 Algeria", value: "algeria", code: "dz" },
  { label: "🇪🇦 Ceuta & Melilla", value: "ceuta-&-melilla", code: "ea" },
  { label: "🇪🇨 Ecuador", value: "ecuador", code: "ec" },
  { label: "🇪🇪 Estonia", value: "estonia", code: "ee" },
  { label: "🇪🇬 Egypt", value: "egypt", code: "eg" },
  { label: "🇪🇭 Western Sahara", value: "western-sahara", code: "eh" },
  { label: "🇪🇷 Eritrea", value: "eritrea", code: "er" },
  { label: "🇪🇸 Spain", value: "spain", code: "es" },
  { label: "🇪🇹 Ethiopia", value: "ethiopia", code: "et" },
  { label: "🇪🇺 European Union", value: "european-union", code: "eu" },
  { label: "🇫🇮 Finland", value: "finland", code: "fi" },
  { label: "🇫🇯 Fiji", value: "fiji", code: "fj" },
  { label: "🇫🇰 Falkland Islands", value: "falkland-islands", code: "fk" },
  { label: "🇫🇲 Micronesia", value: "micronesia", code: "fm" },
  { label: "🇫🇴 Faroe Islands", value: "faroe-islands", code: "fo" },
  { label: "🇫🇷 France", value: "france", code: "fr" },
  { label: "🇬🇦 Gabon", value: "gabon", code: "ga" },
  { label: "🇬🇧 United Kingdom", value: "united-kingdom", code: "gb" },
  { label: "🇬🇩 Grenada", value: "grenada", code: "gd" },
  { label: "🇬🇪 Georgia", value: "georgia", code: "ge" },
  { label: "🇬🇫 French Guiana", value: "french-guiana", code: "gf" },
  { label: "🇬🇬 Guernsey", value: "guernsey", code: "gg" },
  { label: "🇬🇭 Ghana", value: "ghana", code: "gh" },
  { label: "🇬🇮 Gibraltar", value: "gibraltar", code: "gi" },
  { label: "🇬🇱 Greenland", value: "greenland", code: "gl" },
  { label: "🇬🇲 Gambia", value: "gambia", code: "gm" },
  { label: "🇬🇳 Guinea", value: "guinea", code: "gn" },
  { label: "🇬🇵 Guadeloupe", value: "guadeloupe", code: "gp" },
  { label: "🇬🇶 Equatorial Guinea", value: "equatorial-guinea", code: "gq" },
  { label: "🇬🇷 Greece", value: "greece", code: "gr" },
  {
    label: "🇬🇸 South Georgia & South Sandwich Islands",
    value: "south-georgia-&-south-sandwich-islands",
    code: "gs",
  },
  { label: "🇬🇹 Guatemala", value: "guatemala", code: "gt" },
  { label: "🇬🇺 Guam", value: "guam", code: "gu" },
  { label: "🇬🇼 Guinea-Bissau", value: "guinea-bissau", code: "gw" },
  { label: "🇬🇾 Guyana", value: "guyana", code: "gy" },
  { label: "🇭🇰 Hong Kong SAR China", value: "hong-kong-sar-china", code: "hk" },
  {
    label: "🇭🇲 Heard & McDonald Islands",
    value: "heard-&-mcdonald-islands",
    code: "hm",
  },
  { label: "🇭🇳 Honduras", value: "honduras", code: "hn" },
  { label: "🇭🇷 Croatia", value: "croatia", code: "hr" },
  { label: "🇭🇹 Haiti", value: "haiti", code: "ht" },
  { label: "🇭🇺 Hungary", value: "hungary", code: "hu" },
  { label: "🇮🇨 Canary Islands", value: "canary-islands", code: "ic" },
  { label: "🇮🇩 Indonesia", value: "indonesia", code: "id" },
  { label: "🇮🇪 Ireland", value: "ireland", code: "ie" },
  { label: "🇮🇱 Israel", value: "israel", code: "il" },
  { label: "🇮🇲 Isle of Man", value: "isle-of-man", code: "im" },
  { label: "🇮🇳 India", value: "india", code: "in" },
  {
    label: "🇮🇴 British Indian Ocean Territory",
    value: "british-indian-ocean-territory",
    code: "io",
  },
  { label: "🇮🇶 Iraq", value: "iraq", code: "iq" },
  { label: "🇮🇷 Iran", value: "iran", code: "ir" },
  { label: "🇮🇸 Iceland", value: "iceland", code: "is" },
  { label: "🇮🇹 Italy", value: "italy", code: "it" },
  { label: "🇯🇪 Jersey", value: "jersey", code: "je" },
  { label: "🇯🇲 Jamaica", value: "jamaica", code: "jm" },
  { label: "🇯🇴 Jordan", value: "jordan", code: "jo" },
  { label: "🇯🇵 Japan", value: "japan", code: "jp" },
  { label: "🇰🇪 Kenya", value: "kenya", code: "ke" },
  { label: "🇰🇬 Kyrgyzstan", value: "kyrgyzstan", code: "kg" },
  { label: "🇰🇭 Cambodia", value: "cambodia", code: "kh" },
  { label: "🇰🇮 Kiribati", value: "kiribati", code: "ki" },
  { label: "🇰🇲 Comoros", value: "comoros", code: "km" },
  { label: "🇰🇳 St. Kitts & Nevis", value: "st.-kitts-&-nevis", code: "kn" },
  { label: "🇰🇵 North Korea", value: "north-korea", code: "kp" },
  { label: "🇰🇷 South Korea", value: "south-korea", code: "kr" },
  { label: "🇰🇼 Kuwait", value: "kuwait", code: "kw" },
  { label: "🇰🇾 Cayman Islands", value: "cayman-islands", code: "ky" },
  { label: "🇰🇿 Kazakhstan", value: "kazakhstan", code: "kz" },
  { label: "🇱🇦 Laos", value: "laos", code: "la" },
  { label: "🇱🇧 Lebanon", value: "lebanon", code: "lb" },
  { label: "🇱🇨 St. Lucia", value: "st.-lucia", code: "lc" },
  { label: "🇱🇮 Liechtenstein", value: "liechtenstein", code: "li" },
  { label: "🇱🇰 Sri Lanka", value: "sri-lanka", code: "lk" },
  { label: "🇱🇷 Liberia", value: "liberia", code: "lr" },
  { label: "🇱🇸 Lesotho", value: "lesotho", code: "ls" },
  { label: "🇱🇹 Lithuania", value: "lithuania", code: "lt" },
  { label: "🇱🇺 Luxembourg", value: "luxembourg", code: "lu" },
  { label: "🇱🇻 Latvia", value: "latvia", code: "lv" },
  { label: "🇱🇾 Libya", value: "libya", code: "ly" },
  { label: "🇲🇦 Morocco", value: "morocco", code: "ma" },
  { label: "🇲🇨 Monaco", value: "monaco", code: "mc" },
  { label: "🇲🇩 Moldova", value: "moldova", code: "md" },
  { label: "🇲🇪 Montenegro", value: "montenegro", code: "me" },
  { label: "🇲🇫 St. Martin", value: "st.-martin", code: "mf" },
  { label: "🇲🇬 Madagascar", value: "madagascar", code: "mg" },
  { label: "🇲🇭 Marshall Islands", value: "marshall-islands", code: "mh" },
  { label: "🇲🇰 North Macedonia", value: "north-macedonia", code: "mk" },
  { label: "🇲🇱 Mali", value: "mali", code: "ml" },
  { label: "🇲🇲 Myanmar (Burma)", value: "myanmar-(burma)", code: "mm" },
  { label: "🇲🇳 Mongolia", value: "mongolia", code: "mn" },
  { label: "🇲🇴 Macao SAR China", value: "macao-sar-china", code: "mo" },
  {
    label: "🇲🇵 Northern Mariana Islands",
    value: "northern-mariana-islands",
    code: "mp",
  },
  { label: "🇲🇶 Martinique", value: "martinique", code: "mq" },
  { label: "🇲🇷 Mauritania", value: "mauritania", code: "mr" },
  { label: "🇲🇸 Montserrat", value: "montserrat", code: "ms" },
  { label: "🇲🇹 Malta", value: "malta", code: "mt" },
  { label: "🇲🇺 Mauritius", value: "mauritius", code: "mu" },
  { label: "🇲🇻 Maldives", value: "maldives", code: "mv" },
  { label: "🇲🇼 Malawi", value: "malawi", code: "mw" },
  { label: "🇲🇽 Mexico", value: "mexico", code: "mx" },
  { label: "🇲🇾 Malaysia", value: "malaysia", code: "my" },
  { label: "🇲🇿 Mozambique", value: "mozambique", code: "mz" },
  { label: "🇳🇦 Namibia", value: "namibia", code: "na" },
  { label: "🇳🇨 New Caledonia", value: "new-caledonia", code: "nc" },
  { label: "🇳🇪 Niger", value: "niger", code: "ne" },
  { label: "🇳🇫 Norfolk Island", value: "norfolk-island", code: "nf" },
  { label: "🇳🇬 Nigeria", value: "nigeria", code: "ng" },
  { label: "🇳🇮 Nicaragua", value: "nicaragua", code: "ni" },
  { label: "🇳🇱 Netherlands", value: "netherlands", code: "nl" },
  { label: "🇳🇴 Norway", value: "norway", code: "no" },
  { label: "🇳🇵 Nepal", value: "nepal", code: "np" },
  { label: "🇳🇷 Nauru", value: "nauru", code: "nr" },
  { label: "🇳🇺 Niue", value: "niue", code: "nu" },
  { label: "🇳🇿 New Zealand", value: "new-zealand", code: "nz" },
  { label: "🇴🇲 Oman", value: "oman", code: "om" },
  { label: "🇵🇦 Panama", value: "panama", code: "pa" },
  { label: "🇵🇪 Peru", value: "peru", code: "pe" },
  { label: "🇵🇫 French Polynesia", value: "french-polynesia", code: "pf" },
  { label: "🇵🇬 Papua New Guinea", value: "papua-new-guinea", code: "pg" },
  { label: "🇵🇭 Philippines", value: "philippines", code: "ph" },
  { label: "🇵🇰 Pakistan", value: "pakistan", code: "pk" },
  { label: "🇵🇱 Poland", value: "poland", code: "pl" },
  {
    label: "🇵🇲 St. Pierre & Miquelon",
    value: "st.-pierre-&-miquelon",
    code: "pm",
  },
  { label: "🇵🇳 Pitcairn Islands", value: "pitcairn-islands", code: "pn" },
  { label: "🇵🇷 Puerto Rico", value: "puerto-rico", code: "pr" },
  {
    label: "🇵🇸 Palestinian Territories",
    value: "palestinian-territories",
    code: "ps",
  },
  { label: "🇵🇹 Portugal", value: "portugal", code: "pt" },
  { label: "🇵🇼 Palau", value: "palau", code: "pw" },
  { label: "🇵🇾 Paraguay", value: "paraguay", code: "py" },
  { label: "🇶🇦 Qatar", value: "qatar", code: "qa" },
  { label: "🇷🇪 Réunion", value: "réunion", code: "re" },
  { label: "🇷🇴 Romania", value: "romania", code: "ro" },
  { label: "🇷🇸 Serbia", value: "serbia", code: "rs" },
  { label: "🇷🇺 Russia", value: "russia", code: "ru" },
  { label: "🇷🇼 Rwanda", value: "rwanda", code: "rw" },
  { label: "🇸🇦 Saudi Arabia", value: "saudi-arabia", code: "sa" },
  { label: "🇸🇧 Solomon Islands", value: "solomon-islands", code: "sb" },
  { label: "🇸🇨 Seychelles", value: "seychelles", code: "sc" },
  { label: "🇸🇩 Sudan", value: "sudan", code: "sd" },
  { label: "🇸🇪 Sweden", value: "sweden", code: "se" },
  { label: "🇸🇬 Singapore", value: "singapore", code: "sg" },
  { label: "🇸🇭 St. Helena", value: "st.-helena", code: "sh" },
  { label: "🇸🇮 Slovenia", value: "slovenia", code: "si" },
  {
    label: "🇸🇯 Svalbard & Jan Mayen",
    value: "svalbard-&-jan-mayen",
    code: "sj",
  },
  { label: "🇸🇰 Slovakia", value: "slovakia", code: "sk" },
  { label: "🇸🇱 Sierra Leone", value: "sierra-leone", code: "sl" },
  { label: "🇸🇲 San Marino", value: "san-marino", code: "sm" },
  { label: "🇸🇳 Senegal", value: "senegal", code: "sn" },
  { label: "🇸🇴 Somalia", value: "somalia", code: "so" },
  { label: "🇸🇷 Suriname", value: "suriname", code: "sr" },
  { label: "🇸🇸 South Sudan", value: "south-sudan", code: "ss" },
  { label: "🇸🇹 São Tomé & Príncipe", value: "são-tomé-&-príncipe", code: "st" },
  { label: "🇸🇻 El Salvador", value: "el-salvador", code: "sv" },
  { label: "🇸🇽 Sint Maarten", value: "sint-maarten", code: "sx" },
  { label: "🇸🇾 Syria", value: "syria", code: "sy" },
  { label: "🇸🇿 Eswatini", value: "eswatini", code: "sz" },
  { label: "🇹🇦 Tristan da Cunha", value: "tristan-da-cunha", code: "ta" },
  {
    label: "🇹🇨 Turks & Caicos Islands",
    value: "turks-&-caicos-islands",
    code: "tc",
  },
  { label: "🇹🇩 Chad", value: "chad", code: "td" },
  {
    label: "🇹🇫 French Southern Territories",
    value: "french-southern-territories",
    code: "tf",
  },
  { label: "🇹🇬 Togo", value: "togo", code: "tg" },
  { label: "🇹🇭 Thailand", value: "thailand", code: "th" },
  { label: "🇹🇯 Tajikistan", value: "tajikistan", code: "tj" },
  { label: "🇹🇰 Tokelau", value: "tokelau", code: "tk" },
  { label: "🇹🇱 Timor-Leste", value: "timor-leste", code: "tl" },
  { label: "🇹🇲 Turkmenistan", value: "turkmenistan", code: "tm" },
  { label: "🇹🇳 Tunisia", value: "tunisia", code: "tn" },
  { label: "🇹🇴 Tonga", value: "tonga", code: "to" },
  { label: "🇹🇷 Turkey", value: "turkey", code: "tr" },
  { label: "🇹🇹 Trinidad & Tobago", value: "trinidad-&-tobago", code: "tt" },
  { label: "🇹🇻 Tuvalu", value: "tuvalu", code: "tv" },
  { label: "🇹🇼 Taiwan", value: "taiwan", code: "tw" },
  { label: "🇹🇿 Tanzania", value: "tanzania", code: "tz" },
  { label: "🇺🇦 Ukraine", value: "ukraine", code: "ua" },
  { label: "🇺🇬 Uganda", value: "uganda", code: "ug" },
  {
    label: "🇺🇲 U.S. Outlying Islands",
    value: "u.s.-outlying-islands",
    code: "um",
  },
  { label: "🇺🇳 United Nations", value: "united-nations", code: "un" },
  { label: "🇺🇸 United States", value: "united-states", code: "us" },
  { label: "🇺🇾 Uruguay", value: "uruguay", code: "uy" },
  { label: "🇺🇿 Uzbekistan", value: "uzbekistan", code: "uz" },
  { label: "🇻🇦 Vatican City", value: "vatican-city", code: "va" },
  {
    label: "🇻🇨 St. Vincent & Grenadines",
    value: "st.-vincent-&-grenadines",
    code: "vc",
  },
  { label: "🇻🇪 Venezuela", value: "venezuela", code: "ve" },
  {
    label: "🇻🇬 British Virgin Islands",
    value: "british-virgin-islands",
    code: "vg",
  },
  { label: "🇻🇮 U.S. Virgin Islands", value: "u.s.-virgin-islands", code: "vi" },
  { label: "🇻🇳 Vietnam", value: "vietnam", code: "vn" },
  { label: "🇻🇺 Vanuatu", value: "vanuatu", code: "vu" },
  { label: "🇼🇫 Wallis & Futuna", value: "wallis-&-futuna", code: "wf" },
  { label: "🇼🇸 Samoa", value: "samoa", code: "ws" },
  { label: "🇽🇰 Kosovo", value: "kosovo", code: "xk" },
  { label: "🇾🇪 Yemen", value: "yemen", code: "ye" },
  { label: "🇾🇹 Mayotte", value: "mayotte", code: "yt" },
  { label: "🇿🇦 South Africa", value: "south-africa", code: "za" },
  { label: "🇿🇲 Zambia", value: "zambia", code: "zm" },
  { label: "🇿🇼 Zimbabwe", value: "zimbabwe", code: "zw" },
  { label: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", value: "england", code: "england" },
  { label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland", value: "scotland", code: "scotland" },
  { label: "🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales", value: "wales", code: "wales" },
];

export const DIAL_CODES: CountryDialCode[] = [
  { label: "Andorra +376 🇦🇩", value: "+376" },
  { label: "United Arab Emirates +971 🇦🇪", value: "+971" },
  { label: "Afghanistan +93 🇦🇫", value: "+93" },
  { label: "Antigua & Barbuda +1268 🇦🇬", value: "+1268" },
  { label: "Anguilla +1264 🇦🇮", value: "+1264" },
  { label: "Albania +355 🇦🇱", value: "+355" },
  { label: "Armenia +374 🇦🇲", value: "+374" },
  { label: "Angola +244 🇦🇴", value: "+244" },
  { label: "Antarctica +672 🇦🇶", value: "+672" },
  { label: "Argentina +54 🇦🇷", value: "+54" },
  { label: "American Samoa +1684 🇦🇸", value: "+1684" },
  { label: "Austria +43 🇦🇹", value: "+43" },
  { label: "Australia +61 🇦🇺", value: "+61" },
  { label: "Aruba +297 🇦🇼", value: "+297" },
  { label: "Åland Islands +358 🇦🇽", value: "+358" },
  { label: "Azerbaijan +994 🇦🇿", value: "+994" },
  { label: "Bosnia & Herzegovina +387 🇧🇦", value: "+387" },
  { label: "Barbados +1246 🇧🇧", value: "+1246" },
  { label: "Bangladesh +880 🇧🇩", value: "+880" },
  { label: "Belgium +32 🇧🇪", value: "+32" },
  { label: "Burkina Faso +226 🇧🇫", value: "+226" },
  { label: "Bulgaria +359 🇧🇬", value: "+359" },
  { label: "Bahrain +973 🇧🇭", value: "+973" },
  { label: "Burundi +257 🇧🇮", value: "+257" },
  { label: "Benin +229 🇧🇯", value: "+229" },
  { label: "St. Barthélemy +590 🇧🇱", value: "+590" },
  { label: "Bermuda +1441 🇧🇲", value: "+1441" },
  { label: "Brunei +673 🇧🇳", value: "+673" },
  { label: "Bolivia +591 🇧🇴", value: "+591" },
  { label: "Brazil +55 🇧🇷", value: "+55" },
  { label: "Bahamas +1242 🇧🇸", value: "+1242" },
  { label: "Bhutan +975 🇧🇹", value: "+975" },
  { label: "Botswana +267 🇧🇼", value: "+267" },
  { label: "Belarus +375 🇧🇾", value: "+375" },
  { label: "Belize +501 🇧🇿", value: "+501" },
  { label: "Canada +1 🇨🇦", value: "+1" },
  { label: "Cocos (Keeling) Islands +61 🇨🇨", value: "+61" },
  { label: "Congo - Kinshasa +243 🇨🇩", value: "+243" },
  { label: "Central African Republic +236 🇨🇫", value: "+236" },
  { label: "Congo - Brazzaville +242 🇨🇬", value: "+242" },
  { label: "Switzerland +41 🇨🇭", value: "+41" },
  { label: "Côte d’Ivoire +225 🇨🇮", value: "+225" },
  { label: "Cook Islands +682 🇨🇰", value: "+682" },
  { label: "Chile +56 🇨🇱", value: "+56" },
  { label: "Cameroon +237 🇨🇲", value: "+237" },
  { label: "China +86 🇨🇳", value: "+86" },
  { label: "Colombia +57 🇨🇴", value: "+57" },
  { label: "Costa Rica +506 🇨🇷", value: "+506" },
  { label: "Cuba +53 🇨🇺", value: "+53" },
  { label: "Cape Verde +238 🇨🇻", value: "+238" },
  { label: "Christmas Island +61 🇨🇽", value: "+61" },
  { label: "Cyprus +357 🇨🇾", value: "+357" },
  { label: "Czechia +420 🇨🇿", value: "+420" },
  { label: "Germany +49 🇩🇪", value: "+49" },
  { label: "Djibouti +253 🇩🇯", value: "+253" },
  { label: "Denmark +45 🇩🇰", value: "+45" },
  { label: "Dominica +1767 🇩🇲", value: "+1767" },
  { label: "Dominican Republic +1849 🇩🇴", value: "+1849" },
  { label: "Algeria +213 🇩🇿", value: "+213" },
  { label: "Ecuador +593 🇪🇨", value: "+593" },
  { label: "Estonia +372 🇪🇪", value: "+372" },
  { label: "Egypt +20 🇪🇬", value: "+20" },
  { label: "Eritrea +291 🇪🇷", value: "+291" },
  { label: "Spain +34 🇪🇸", value: "+34" },
  { label: "Ethiopia +251 🇪🇹", value: "+251" },
  { label: "Finland +358 🇫🇮", value: "+358" },
  { label: "Fiji +679 🇫🇯", value: "+679" },
  { label: "Falkland Islands +500 🇫🇰", value: "+500" },
  { label: "Micronesia +691 🇫🇲", value: "+691" },
  { label: "Faroe Islands +298 🇫🇴", value: "+298" },
  { label: "France +33 🇫🇷", value: "+33" },
  { label: "Gabon +241 🇬🇦", value: "+241" },
  { label: "United Kingdom +44 🇬🇧", value: "+44" },
  { label: "Grenada +1473 🇬🇩", value: "+1473" },
  { label: "Georgia +995 🇬🇪", value: "+995" },
  { label: "French Guiana +594 🇬🇫", value: "+594" },
  { label: "Guernsey +44 🇬🇬", value: "+44" },
  { label: "Ghana +233 🇬🇭", value: "+233" },
  { label: "Gibraltar +350 🇬🇮", value: "+350" },
  { label: "Greenland +299 🇬🇱", value: "+299" },
  { label: "Gambia +220 🇬🇲", value: "+220" },
  { label: "Guinea +224 🇬🇳", value: "+224" },
  { label: "Guadeloupe +590 🇬🇵", value: "+590" },
  { label: "Equatorial Guinea +240 🇬🇶", value: "+240" },
  { label: "Greece +30 🇬🇷", value: "+30" },
  { label: "South Georgia & South Sandwich Islands +500 🇬🇸", value: "+500" },
  { label: "Guatemala +502 🇬🇹", value: "+502" },
  { label: "Guam +1671 🇬🇺", value: "+1671" },
  { label: "Guinea-Bissau +245 🇬🇼", value: "+245" },
  { label: "Guyana +595 🇬🇾", value: "+595" },
  { label: "Hong Kong SAR China +852 🇭🇰", value: "+852" },
  { label: "Honduras +504 🇭🇳", value: "+504" },
  { label: "Croatia +385 🇭🇷", value: "+385" },
  { label: "Haiti +509 🇭🇹", value: "+509" },
  { label: "Hungary +36 🇭🇺", value: "+36" },
  { label: "Indonesia +62 🇮🇩", value: "+62" },
  { label: "Ireland +353 🇮🇪", value: "+353" },
  { label: "Israel +972 🇮🇱", value: "+972" },
  { label: "Isle of Man +44 🇮🇲", value: "+44" },
  { label: "India +91 🇮🇳", value: "+91" },
  { label: "British Indian Ocean Territory +246 🇮🇴", value: "+246" },
  { label: "Iraq +964 🇮🇶", value: "+964" },
  { label: "Iran +98 🇮🇷", value: "+98" },
  { label: "Iceland +354 🇮🇸", value: "+354" },
  { label: "Italy +39 🇮🇹", value: "+39" },
  { label: "Jersey +44 🇯🇪", value: "+44" },
  { label: "Jamaica +1876 🇯🇲", value: "+1876" },
  { label: "Jordan +962 🇯🇴", value: "+962" },
  { label: "Japan +81 🇯🇵", value: "+81" },
  { label: "Kenya +254 🇰🇪", value: "+254" },
  { label: "Kyrgyzstan +996 🇰🇬", value: "+996" },
  { label: "Cambodia +855 🇰🇭", value: "+855" },
  { label: "Kiribati +686 🇰🇮", value: "+686" },
  { label: "Comoros +269 🇰🇲", value: "+269" },
  { label: "St. Kitts & Nevis +1869 🇰🇳", value: "+1869" },
  { label: "North Korea +850 🇰🇵", value: "+850" },
  { label: "South Korea +82 🇰🇷", value: "+82" },
  { label: "Kuwait +965 🇰🇼", value: "+965" },
  { label: "Cayman Islands + 345 🇰🇾", value: "+ 345" },
  { label: "Kazakhstan +77 🇰🇿", value: "+77" },
  { label: "Laos +856 🇱🇦", value: "+856" },
  { label: "Lebanon +961 🇱🇧", value: "+961" },
  { label: "St. Lucia +1758 🇱🇨", value: "+1758" },
  { label: "Liechtenstein +423 🇱🇮", value: "+423" },
  { label: "Sri Lanka +94 🇱🇰", value: "+94" },
  { label: "Liberia +231 🇱🇷", value: "+231" },
  { label: "Lesotho +266 🇱🇸", value: "+266" },
  { label: "Lithuania +370 🇱🇹", value: "+370" },
  { label: "Luxembourg +352 🇱🇺", value: "+352" },
  { label: "Latvia +371 🇱🇻", value: "+371" },
  { label: "Libya +218 🇱🇾", value: "+218" },
  { label: "Morocco +212 🇲🇦", value: "+212" },
  { label: "Monaco +377 🇲🇨", value: "+377" },
  { label: "Moldova +373 🇲🇩", value: "+373" },
  { label: "Montenegro +382 🇲🇪", value: "+382" },
  { label: "St. Martin +590 🇲🇫", value: "+590" },
  { label: "Madagascar +261 🇲🇬", value: "+261" },
  { label: "Marshall Islands +692 🇲🇭", value: "+692" },
  { label: "North Macedonia +389 🇲🇰", value: "+389" },
  { label: "Mali +223 🇲🇱", value: "+223" },
  { label: "Myanmar (Burma) +95 🇲🇲", value: "+95" },
  { label: "Mongolia +976 🇲🇳", value: "+976" },
  { label: "Macao SAR China +853 🇲🇴", value: "+853" },
  { label: "Northern Mariana Islands +1670 🇲🇵", value: "+1670" },
  { label: "Martinique +596 🇲🇶", value: "+596" },
  { label: "Mauritania +222 🇲🇷", value: "+222" },
  { label: "Montserrat +1664 🇲🇸", value: "+1664" },
  { label: "Malta +356 🇲🇹", value: "+356" },
  { label: "Mauritius +230 🇲🇺", value: "+230" },
  { label: "Maldives +960 🇲🇻", value: "+960" },
  { label: "Malawi +265 🇲🇼", value: "+265" },
  { label: "Mexico +52 🇲🇽", value: "+52" },
  { label: "Malaysia +60 🇲🇾", value: "+60" },
  { label: "Mozambique +258 🇲🇿", value: "+258" },
  { label: "Namibia +264 🇳🇦", value: "+264" },
  { label: "New Caledonia +687 🇳🇨", value: "+687" },
  { label: "Niger +227 🇳🇪", value: "+227" },
  { label: "Norfolk Island +672 🇳🇫", value: "+672" },
  { label: "Nigeria +234 🇳🇬", value: "+234" },
  { label: "Nicaragua +505 🇳🇮", value: "+505" },
  { label: "Netherlands +31 🇳🇱", value: "+31" },
  { label: "Norway +47 🇳🇴", value: "+47" },
  { label: "Nepal +977 🇳🇵", value: "+977" },
  { label: "Nauru +674 🇳🇷", value: "+674" },
  { label: "Niue +683 🇳🇺", value: "+683" },
  { label: "New Zealand +64 🇳🇿", value: "+64" },
  { label: "Oman +968 🇴🇲", value: "+968" },
  { label: "Panama +507 🇵🇦", value: "+507" },
  { label: "Peru +51 🇵🇪", value: "+51" },
  { label: "French Polynesia +689 🇵🇫", value: "+689" },
  { label: "Papua New Guinea +675 🇵🇬", value: "+675" },
  { label: "Philippines +63 🇵🇭", value: "+63" },
  { label: "Pakistan +92 🇵🇰", value: "+92" },
  { label: "Poland +48 🇵🇱", value: "+48" },
  { label: "St. Pierre & Miquelon +508 🇵🇲", value: "+508" },
  { label: "Pitcairn Islands +872 🇵🇳", value: "+872" },
  { label: "Puerto Rico +1939 🇵🇷", value: "+1939" },
  { label: "Palestinian Territories +970 🇵🇸", value: "+970" },
  { label: "Portugal +351 🇵🇹", value: "+351" },
  { label: "Palau +680 🇵🇼", value: "+680" },
  { label: "Paraguay +595 🇵🇾", value: "+595" },
  { label: "Qatar +974 🇶🇦", value: "+974" },
  { label: "Réunion +262 🇷🇪", value: "+262" },
  { label: "Romania +40 🇷🇴", value: "+40" },
  { label: "Serbia +381 🇷🇸", value: "+381" },
  { label: "Russia +7 🇷🇺", value: "+7" },
  { label: "Rwanda +250 🇷🇼", value: "+250" },
  { label: "Saudi Arabia +966 🇸🇦", value: "+966" },
  { label: "Solomon Islands +677 🇸🇧", value: "+677" },
  { label: "Seychelles +248 🇸🇨", value: "+248" },
  { label: "Sudan +249 🇸🇩", value: "+249" },
  { label: "Sweden +46 🇸🇪", value: "+46" },
  { label: "Singapore +65 🇸🇬", value: "+65" },
  { label: "St. Helena +290 🇸🇭", value: "+290" },
  { label: "Slovenia +386 🇸🇮", value: "+386" },
  { label: "Svalbard & Jan Mayen +47 🇸🇯", value: "+47" },
  { label: "Slovakia +421 🇸🇰", value: "+421" },
  { label: "Sierra Leone +232 🇸🇱", value: "+232" },
  { label: "San Marino +378 🇸🇲", value: "+378" },
  { label: "Senegal +221 🇸🇳", value: "+221" },
  { label: "Somalia +252 🇸🇴", value: "+252" },
  { label: "Suriname +597 🇸🇷", value: "+597" },
  { label: "South Sudan +211 🇸🇸", value: "+211" },
  { label: "São Tomé & Príncipe +239 🇸🇹", value: "+239" },
  { label: "El Salvador +503 🇸🇻", value: "+503" },
  { label: "Syria +963 🇸🇾", value: "+963" },
  { label: "Eswatini +268 🇸🇿", value: "+268" },
  { label: "Turks & Caicos Islands +1649 🇹🇨", value: "+1649" },
  { label: "Chad +235 🇹🇩", value: "+235" },
  { label: "Togo +228 🇹🇬", value: "+228" },
  { label: "Thailand +66 🇹🇭", value: "+66" },
  { label: "Tajikistan +992 🇹🇯", value: "+992" },
  { label: "Tokelau +690 🇹🇰", value: "+690" },
  { label: "Timor-Leste +670 🇹🇱", value: "+670" },
  { label: "Turkmenistan +993 🇹🇲", value: "+993" },
  { label: "Tunisia +216 🇹🇳", value: "+216" },
  { label: "Tonga +676 🇹🇴", value: "+676" },
  { label: "Turkey +90 🇹🇷", value: "+90" },
  { label: "Trinidad & Tobago +1868 🇹🇹", value: "+1868" },
  { label: "Tuvalu +688 🇹🇻", value: "+688" },
  { label: "Taiwan +886 🇹🇼", value: "+886" },
  { label: "Tanzania +255 🇹🇿", value: "+255" },
  { label: "Ukraine +380 🇺🇦", value: "+380" },
  { label: "Uganda +256 🇺🇬", value: "+256" },
  { label: "United States +1 🇺🇸", value: "+1" },
  { label: "Uruguay +598 🇺🇾", value: "+598" },
  { label: "Uzbekistan +998 🇺🇿", value: "+998" },
  { label: "Vatican City +379 🇻🇦", value: "+379" },
  { label: "St. Vincent & Grenadines +1784 🇻🇨", value: "+1784" },
  { label: "Venezuela +58 🇻🇪", value: "+58" },
  { label: "British Virgin Islands +1284 🇻🇬", value: "+1284" },
  { label: "U.S. Virgin Islands +1340 🇻🇮", value: "+1340" },
  { label: "Vietnam +84 🇻🇳", value: "+84" },
  { label: "Vanuatu +678 🇻🇺", value: "+678" },
  { label: "Wallis & Futuna +681 🇼🇫", value: "+681" },
  { label: "Samoa +685 🇼🇸", value: "+685" },
  { label: "Yemen +967 🇾🇪", value: "+967" },
  { label: "Mayotte +262 🇾🇹", value: "+262" },
  { label: "South Africa +27 🇿🇦", value: "+27" },
  { label: "Zambia +260 🇿🇲", value: "+260" },
  { label: "Zimbabwe +263 🇿🇼", value: "+263" },
];
