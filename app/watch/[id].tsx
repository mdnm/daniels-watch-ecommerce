import { FontAwesome } from "@expo/vector-icons";
import {
  Button,
  Center,
  Divider,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  config,
} from "@gluestack-ui/themed";
import { Stack, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useItems } from "../../hooks/useItems";

const COUNTRY_CODE_TO_NAME: { [key: string]: string } = {
  af: "Afghanistan",
  ax: "Aland Islands",
  al: "Albania",
  dz: "Algeria",
  as: "American Samoa",
  ad: "Andorra",
  ao: "Angola",
  ai: "Anguilla",
  aq: "Antarctica",
  ag: "Antigua and Barbuda",
  ar: "Argentina",
  am: "Armenia",
  aw: "Aruba",
  au: "Australia",
  at: "Austria",
  az: "Azerbaijan",
  bs: "Bahamas",
  bh: "Bahrain",
  bd: "Bangladesh",
  bb: "Barbados",
  by: "Belarus",
  be: "Belgium",
  bz: "Belize",
  bj: "Benin",
  bm: "Bermuda",
  bt: "Bhutan",
  bo: "Bolivia",
  ba: "Bosnia and Herzegovina",
  bw: "Botswana",
  bv: "Bouvet Island",
  br: "Brazil",
  io: "British Indian Ocean Territory",
  vg: "British Virgin Islands",
  bn: "Brunei",
  bg: "Bulgaria",
  bf: "Burkina Faso",
  bi: "Burundi",
  kh: "Cambodia",
  cm: "Cameroon",
  ca: "Canada",
  cv: "Cape Verde",
  ky: "Cayman Islands",
  cf: "Central African Republic",
  td: "Chad",
  cl: "Chile",
  cn: "China",
  cx: "Christmas Island",
  cc: "Cocos Island",
  co: "Colombia",
  km: "Comoros",
  cg: "Congo",
  cd: "Congo, Democratic Republic of",
  ck: "Cook Islands",
  cr: "Costa Rica",
  ci: "C&ocirc;te d'Ivoire",
  hr: "Croatia",
  cu: "Cuba",
  cy: "Cyprus",
  cz: "Czech Republic",
  dk: "Denmark",
  xx: "Disputed Territory",
  dj: "Djibouti",
  dm: "Dominica",
  do: "Dominican Republic",
  ec: "Ecuador",
  eg: "Egypt",
  sv: "El Salvador",
  gq: "Equatorial Guinea",
  er: "Eritrea",
  ee: "Estonia",
  et: "Ethiopia",
  fk: "Falkland Islands",
  fo: "Faroe Islands",
  fj: "Fiji",
  fi: "Finland",
  fr: "France",
  gf: "French Guiana",
  pf: "French Polynesia",
  tf: "French Southern Territories",
  ga: "Gabon",
  gm: "Gambia",
  ge: "Georgia",
  de: "Germany",
  gh: "Ghana",
  gi: "Gibraltar",
  gr: "Greece",
  gl: "Greenland",
  gd: "Grenada",
  gp: "Guadeloupe",
  gu: "Guam",
  gt: "Guatemala",
  gg: "Guernsey",
  gn: "Guinea",
  gw: "Guinea-Bissau",
  gy: "Guyana",
  ht: "Haiti",
  hm: "Heard Islands and McDonald Islands",
  hn: "Honduras",
  hk: "Hong Kong",
  hu: "Hungary",
  is: "Iceland",
  in: "India",
  id: "Indonesia",
  ir: "Iran",
  iq: "Iraq",
  xe: "Iraq-Saudi Arabia Neutral Zone",
  ie: "Ireland",
  im: "Isle of Man",
  il: "Israel",
  it: "Italy",
  jm: "Jamaica",
  jp: "Japan",
  je: "Jersey",
  jo: "Jordan",
  kz: "Kazakhstan",
  ke: "Kenya",
  ki: "Kiribati",
  kw: "Kuwait",
  kg: "Kyrgyzstan",
  la: "Laos",
  lv: "Latvia",
  lb: "Lebanon",
  ls: "Lesotho",
  lr: "Liberia",
  ly: "Libya",
  li: "Liechtenstein",
  lt: "Lithuania",
  lu: "Luxembourg",
  mo: "Macao",
  mk: "Macedonia",
  mg: "Madagascar",
  mw: "Malawi",
  my: "Malaysia",
  mv: "Maldives",
  ml: "Mali",
  mt: "Malta",
  mh: "Marshall Islands",
  mr: "Mauritania",
  mu: "Mauritius",
  yt: "Mayotte",
  mx: "Mexico",
  fm: "Micronesia",
  md: "Moldova",
  mc: "Monaco",
  mn: "Mongolia",
  me: "Montenegro",
  ms: "Montserrat",
  ma: "Morocco",
  mz: "Mozambique",
  mm: "Myanmar",
  na: "Namibia",
  nr: "Nauru",
  np: "Nepal",
  nl: "Netherlands",
  an: "Netherlands Antilles",
  nc: "New Caledonia",
  nz: "New Zealand",
  ni: "Nicaragua",
  ne: "Niger",
  ng: "Nigeria",
  nu: "Niue",
  nf: "Norfolk Island",
  mp: "Northern Mariana Islands",
  kp: "North Korea",
  no: "Norway",
  om: "Oman",
  pk: "Pakistan",
  pw: "Palau",
  ps: "Palestinian Territory",
  pa: "Panama",
  pg: "Papua New Guinea",
  py: "Paraguay",
  pe: "Peru",
  ph: "Philippines",
  pn: "Pitcairn Islands",
  pl: "Poland",
  pt: "Portugal",
  pr: "Puerto Rico",
  qa: "Qatar",
  re: "Reunion",
  ro: "Romania",
  ru: "Russia",
  rw: "Rwanda",
  sh: "Saint Helena",
  kn: "Saint Kitts and Nevis",
  lc: "Sant Lucia",
  pm: "Saint Pierre and Miquelon",
  vc: "Sant Vincent and the Grenadines",
  ws: "Samoa",
  sm: "San Marino",
  st: "S&atilde;p Tom&eacute; and Pr&iacute;ncipe",
  sa: "Saudi Arabia",
  sn: "Senegal",
  rs: "Serbia",
  cs: "Serbia and Montenegro",
  sc: "Seychelles",
  sl: "Sierra Leone",
  sg: "Singapore",
  sk: "Slovakia",
  si: "Slovenia",
  sb: "Solomon Islands",
  so: "Somalia",
  za: "South Africa",
  gs: "South Georgia and the South Sandwich Islands",
  kr: "South Korea",
  es: "Spain",
  lk: "Sri Lanka",
  sd: "Sudan",
  sr: "Suriname",
  sj: "Svalbard and Jan Mayen Islands",
  sz: "Swaziland",
  se: "Sweden",
  ch: "Switzerland",
  sy: "Syria",
  tw: "Taiwan",
  tj: "Tajikistan",
  tz: "Tanzania",
  th: "Thailand",
  tl: "Timor-Leste",
  tg: "Togo",
  tk: "Tokelau",
  to: "Tonga",
  tt: "Trinidad and Tobago",
  tn: "Tunisia",
  tr: "Turkey",
  tm: "Turkmenistan",
  tc: "Turks and Caicos Islands",
  tv: "Tuvalu",
  ug: "Uganda",
  ua: "Ukraine",
  ae: "United Arab Emirates",
  uk: "United Kingdom",
  xd: "United Nations Neutral Zone",
  us: "United States",
  um: "United States Minor Outlying Islands",
  vi: "U.S. Virgin Islands",
  uy: "Uruguay",
  uz: "Uzbekistan",
  vu: "Vanuatu",
  va: "Vatican City",
  ve: "Venezuela",
  vn: "Vietnam",
  wf: "Wallis and Futuna Islands",
  eh: "Western Sahara",
  ye: "Yemen",
  zm: "Zambia",
  zw: "Zimbabwe",
};

export default function WatchDetails() {
  const { id } = useGlobalSearchParams();
  const { items, setItemAsFavorite } = useItems();
  const watch = items.find((item) => item.key === id);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const url = `https://ipinfo.io?token=2c5027935626e9`;

      const response = await fetch(url);

      const data = await response.json();

      const country =
        COUNTRY_CODE_TO_NAME[data.country?.toLocaleLowerCase()] ?? data.country;

      setCountry(country);
    })();
  }, []);

  if (!watch) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Stack.Screen
          options={{
            title: "Details",
            headerLeft: (e) => {
              if (!e.canGoBack) return null;

              return (
                <Button
                  onPress={() => router.back()}
                  bgColor="transparent"
                  pl={"$1"}
                >
                  <FontAwesome name="chevron-left" size={24} />
                </Button>
              );
            },
            headerRight: () => {
              return (
                <Button
                  onPress={() => setItemAsFavorite(watch, true)}
                  bgColor="transparent"
                  pr={"$1"}
                >
                  <FontAwesome
                    name={watch.isFavorite ? "heart" : "heart-o"}
                    size={24}
                    color={
                      watch.isFavorite
                        ? config.theme.tokens.colors.green600
                        : config.theme.tokens.colors.black
                    }
                  />
                </Button>
              );
            },
          }}
        />
        <Center w={"$full"} position="relative" mb={"$6"}>
          <Image
            source={require("../../assets/images/rolex.png")}
            position="absolute"
            w="$full"
            blurRadius={20}
          />
          <Image source={require("../../assets/images/rolex.png")} />
        </Center>
        <VStack w={"$full"} gap={"$6"} px={"$4"} mb={"$8"}>
          <VStack gap={"$2"}>
            <Heading fontSize={"$2xl"}>Day-Date {watch.key}</Heading>
            <Text fontSize={"$lg"} color="$black">
              Oyster, 36mm, yellow gold
            </Text>
          </VStack>
          <VStack gap={"$2"}>
            <Heading fontSize={"$2xl"}>{watch.price}</Heading>
            {country && (
              <Text fontSize={"$lg"} color="$black">
                € 200 shipping price to {country}
              </Text>
            )}
          </VStack>
          <Text fontSize={"$lg"} color="$black">
            New{"  "}|{"  "}With original box{"  "}|{"  "}With original
            documents
          </Text>
          <Button action="positive" size="xl" rounded={"$lg"}>
            <Text fontSize={"$lg"} color="$white">
              Buy
            </Text>
          </Button>
        </VStack>
        <VStack w={"$full"} gap={"$2"}>
          <Heading px={"$4"} fontSize={"$2xl"} mb={"$4"}>
            Watch Details
          </Heading>
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Brand
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              Omega
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Model
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              Speedmaster Date
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Reference Number
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              323.30.40.40.01.001
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Movement
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              Automatic
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Box material
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              Steel
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Bracelet material
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              Crocodile skin
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Year
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              2019
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Condition
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              New (Brand new, without any signs of wear)
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
          <HStack px={"$4"} justifyContent="space-between" alignItems="center">
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black" bold>
              Location
            </Text>
            <Text maxWidth={"50%"} fontSize={"$lg"} color="$black">
              {watch.location}
            </Text>
          </HStack>
          <Divider mb={"$6"} w={"$full"} />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
