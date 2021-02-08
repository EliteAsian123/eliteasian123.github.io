// Based off of https://github.com/dariusk/corpora/blob/master/data/words/common.json
let commonWords = [
	"a",
	"able",
	"about",
	"absolute",
	"accept",
	"account",
	"achieve",
	"across",
	"act",
	"active",
	"actual",
	"add",
	"address",
	"admit",
	"advertise",
	"affect",
	"afford",
	"after",
	"afternoon",
	"again",
	"against",
	"age",
	"agent",
	"ago",
	"agree",
	"air",
	"all",
	"allow",
	"almost",
	"along",
	"already",
	"alright",
	"also",
	"although",
	"always",
	"america",
	"amount",
	"and",
	"another",
	"answer",
	"any",
	"apart",
	"apparent",
	"appear",
	"apply",
	"appoint",
	"approach",
	"appropriate",
	"area",
	"argue",
	"arm",
	"around",
	"arrange",
	"art",
	"as",
	"ask",
	"associate",
	"assume",
	"at",
	"attend",
	"authority",
	"available",
	"aware",
	"away",
	"awful",
	"baby",
	"back",
	"bad",
	"bag",
	"balance",
	"ball",
	"bank",
	"bar",
	"base",
	"basis",
	"be",
	"bear",
	"beat",
	"beauty",
	"because",
	"become",
	"bed",
	"before",
	"begin",
	"behind",
	"believe",
	"benefit",
	"best",
	"bet",
	"between",
	"big",
	"bill",
	"birth",
	"bit",
	"black",
	"bloke",
	"blood",
	"blow",
	"blue",
	"board",
	"boat",
	"body",
	"book",
	"both",
	"bother",
	"bottle",
	"bottom",
	"box",
	"boy",
	"break",
	"brief",
	"brilliant",
	"bring",
	"britain",
	"brother",
	"budget",
	"build",
	"bus",
	"business",
	"busy",
	"but",
	"buy",
	"by",
	"cake",
	"call",
	"can",
	"car",
	"card",
	"care",
	"carry",
	"case",
	"cat",
	"catch",
	"cause",
	"cent",
	"centre",
	"certain",
	"chair",
	"chairman",
	"chance",
	"change",
	"chap",
	"character",
	"charge",
	"cheap",
	"check",
	"child",
	"choice",
	"choose",
	"christ",
	"christmas",
	"church",
	"city",
	"claim",
	"class",
	"clean",
	"clear",
	"client",
	"clock",
	"close",
	"closes",
	"clothe",
	"club",
	"coffee",
	"cold",
	"colleague",
	"collect",
	"college",
	"colour",
	"come",
	"comment",
	"commit",
	"committee",
	"common",
	"community",
	"company",
	"compare",
	"complete",
	"compute",
	"concern",
	"condition",
	"confer",
	"consider",
	"consult",
	"contact",
	"continue",
	"contract",
	"control",
	"converse",
	"cook",
	"copy",
	"corner",
	"correct",
	"cost",
	"could",
	"council",
	"count",
	"country",
	"county",
	"couple",
	"course",
	"court",
	"cover",
	"create",
	"cross",
	"cup",
	"current",
	"cut",
	"dad",
	"danger",
	"date",
	"day",
	"dead",
	"deal",
	"dear",
	"debate",
	"decide",
	"decision",
	"deep",
	"definite",
	"degree",
	"department",
	"depend",
	"describe",
	"design",
	"detail",
	"develop",
	"die",
	"difference",
	"difficult",
	"dinner",
	"direct",
	"discuss",
	"district",
	"divide",
	"do",
	"doctor",
	"document",
	"dog",
	"door",
	"double",
	"doubt",
	"down",
	"draw",
	"dress",
	"drink",
	"drive",
	"drop",
	"dry",
	"due",
	"during",
	"each",
	"early",
	"east",
	"easy",
	"eat",
	"economy",
	"educate",
	"effect",
	"egg",
	"eight",
	"either",
	"elect",
	"electric",
	"eleven",
	"else",
	"employ",
	"encourage",
	"end",
	"engine",
	"english",
	"enjoy",
	"enough",
	"enter",
	"environment",
	"equal",
	"especial",
	"europe",
	"even",
	"evening",
	"ever",
	"every",
	"evidence",
	"exact",
	"example",
	"except",
	"excuse",
	"exercise",
	"exist",
	"expect",
	"expense",
	"experience",
	"explain",
	"express",
	"extra",
	"eye",
	"face",
	"fact",
	"fair",
	"fall",
	"family",
	"far",
	"farm",
	"fast",
	"father",
	"favour",
	"feed",
	"feel",
	"few",
	"field",
	"fight",
	"figure",
	"file",
	"fill",
	"film",
	"final",
	"finance",
	"find",
	"fine",
	"finish",
	"fire",
	"first",
	"fish",
	"fit",
	"five",
	"flat",
	"floor",
	"fly",
	"follow",
	"food",
	"foot",
	"for",
	"force",
	"forget",
	"form",
	"fortune",
	"forward",
	"four",
	"france",
	"free",
	"friday",
	"friend",
	"from",
	"front",
	"full",
	"fun",
	"function",
	"fund",
	"further",
	"future",
	"game",
	"garden",
	"gas",
	"general",
	"germany",
	"get",
	"girl",
	"give",
	"glass",
	"go",
	"god",
	"good",
	"goodbye",
	"govern",
	"grand",
	"grant",
	"great",
	"green",
	"ground",
	"group",
	"grow",
	"guess",
	"guy",
	"hair",
	"half",
	"hall",
	"hand",
	"hang",
	"happen",
	"happy",
	"hard",
	"hate",
	"have",
	"he",
	"head",
	"health",
	"hear",
	"heart",
	"heat",
	"heavy",
	"help",
	"here",
	"high",
	"history",
	"hit",
	"hold",
	"holiday",
	"home",
	"honest",
	"hope",
	"horse",
	"hospital",
	"hot",
	"hour",
	"house",
	"how",
	"however",
	"hullo",
	"hundred",
	"husband",
	"idea",
	"identify",
	"if",
	"imagine",
	"important",
	"improve",
	"in",
	"include",
	"income",
	"increase",
	"indeed",
	"individual",
	"industry",
	"inform",
	"inside",
	"instead",
	"insure",
	"interest",
	"into",
	"introduce",
	"invest",
	"involve",
	"issue",
	"it",
	"item",
	"jesus",
	"job",
	"join",
	"judge",
	"jump",
	"just",
	"keep",
	"key",
	"kid",
	"kill",
	"kind",
	"king",
	"kitchen",
	"knock",
	"know",
	"labour",
	"lad",
	"lady",
	"land",
	"language",
	"large",
	"last",
	"late",
	"laugh",
	"law",
	"lay",
	"lead",
	"learn",
	"leave",
	"left",
	"leg",
	"less",
	"let",
	"letter",
	"level",
	"lie",
	"life",
	"light",
	"like",
	"likely",
	"limit",
	"line",
	"link",
	"list",
	"listen",
	"little",
	"live",
	"load",
	"local",
	"lock",
	"london",
	"long",
	"look",
	"lord",
	"lose",
	"lot",
	"love",
	"low",
	"luck",
	"lunch",
	"machine",
	"main",
	"major",
	"make",
	"man",
	"manage",
	"many",
	"mark",
	"market",
	"marry",
	"match",
	"matter",
	"may",
	"maybe",
	"mean",
	"meaning",
	"measure",
	"meet",
	"member",
	"mention",
	"middle",
	"might",
	"mile",
	"milk",
	"million",
	"mind",
	"minister",
	"minus",
	"minute",
	"miss",
	"mister",
	"moment",
	"monday",
	"money",
	"month",
	"more",
	"morning",
	"most",
	"mother",
	"motion",
	"move",
	"much",
	"music",
	"must",
	"name",
	"nation",
	"nature",
	"near",
	"necessary",
	"need",
	"never",
	"new",
	"news",
	"next",
	"nice",
	"night",
	"nine",
	"no",
	"non",
	"none",
	"normal",
	"north",
	"not",
	"note",
	"notice",
	"now",
	"number",
	"obvious",
	"occasion",
	"odd",
	"of",
	"off",
	"offer",
	"office",
	"often",
	"okay",
	"old",
	"on",
	"once",
	"one",
	"only",
	"open",
	"operate",
	"opportunity",
	"oppose",
	"or",
	"order",
	"organize",
	"original",
	"other",
	"otherwise",
	"ought",
	"out",
	"over",
	"own",
	"pack",
	"page",
	"paint",
	"pair",
	"paper",
	"paragraph",
	"pardon",
	"parent",
	"park",
	"part",
	"particular",
	"party",
	"pass",
	"past",
	"pay",
	"pence",
	"pension",
	"people",
	"per",
	"percent",
	"perfect",
	"perhaps",
	"period",
	"person",
	"photograph",
	"pick",
	"picture",
	"piece",
	"place",
	"plan",
	"play",
	"please",
	"plus",
	"point",
	"police",
	"policy",
	"politic",
	"poor",
	"position",
	"positive",
	"possible",
	"post",
	"pound",
	"power",
	"practice",
	"prepare",
	"present",
	"press",
	"pressure",
	"presume",
	"pretty",
	"previous",
	"price",
	"print",
	"private",
	"probable",
	"problem",
	"proceed",
	"process",
	"produce",
	"product",
	"programme",
	"project",
	"proper",
	"propose",
	"protect",
	"provide",
	"public",
	"pull",
	"purpose",
	"push",
	"put",
	"quality",
	"quarter",
	"question",
	"quick",
	"quid",
	"quiet",
	"quite",
	"radio",
	"rail",
	"raise",
	"range",
	"rate",
	"rather",
	"read",
	"ready",
	"real",
	"realise",
	"really",
	"reason",
	"receive",
	"recent",
	"reckon",
	"recognize",
	"recommend",
	"record",
	"red",
	"reduce",
	"refer",
	"regard",
	"region",
	"relation",
	"remember",
	"report",
	"represent",
	"require",
	"research",
	"resource",
	"respect",
	"responsible",
	"rest",
	"result",
	"return",
	"rid",
	"right",
	"ring",
	"rise",
	"road",
	"role",
	"roll",
	"room",
	"round",
	"rule",
	"run",
	"safe",
	"sale",
	"same",
	"saturday",
	"save",
	"say",
	"scheme",
	"school",
	"science",
	"score",
	"scotland",
	"seat",
	"second",
	"secretary",
	"section",
	"secure",
	"see",
	"seem",
	"self",
	"sell",
	"send",
	"sense",
	"separate",
	"serious",
	"serve",
	"service",
	"set",
	"settle",
	"seven",
	"shall",
	"share",
	"she",
	"sheet",
	"shoe",
	"shoot",
	"shop",
	"short",
	"should",
	"show",
	"shut",
	"sick",
	"side",
	"sign",
	"similar",
	"simple",
	"since",
	"sing",
	"single",
	"sister",
	"sit",
	"site",
	"situate",
	"six",
	"size",
	"sleep",
	"slight",
	"slow",
	"small",
	"smoke",
	"so",
	"social",
	"society",
	"some",
	"son",
	"soon",
	"sorry",
	"sort",
	"sound",
	"south",
	"space",
	"speak",
	"special",
	"specific",
	"speed",
	"spell",
	"spend",
	"square",
	"staff",
	"stage",
	"stairs",
	"stand",
	"standard",
	"start",
	"state",
	"station",
	"stay",
	"step",
	"stick",
	"still",
	"stop",
	"story",
	"straight",
	"strategy",
	"street",
	"strike",
	"strong",
	"structure",
	"student",
	"study",
	"stuff",
	"stupid",
	"subject",
	"succeed",
	"such",
	"sudden",
	"suggest",
	"suit",
	"summer",
	"sun",
	"sunday",
	"supply",
	"support",
	"suppose",
	"sure",
	"surprise",
	"switch",
	"system",
	"table",
	"take",
	"talk",
	"tape",
	"tax",
	"tea",
	"teach",
	"team",
	"telephone",
	"television",
	"tell",
	"ten",
	"tend",
	"term",
	"terrible",
	"test",
	"than",
	"thank",
	"the",
	"then",
	"there",
	"therefore",
	"they",
	"thing",
	"think",
	"thirteen",
	"thirty",
	"this",
	"thou",
	"though",
	"thousand",
	"three",
	"through",
	"throw",
	"thursday",
	"tie",
	"time",
	"to",
	"today",
	"together",
	"tomorrow",
	"tonight",
	"too",
	"top",
	"total",
	"touch",
	"toward",
	"town",
	"trade",
	"traffic",
	"train",
	"transport",
	"travel",
	"treat",
	"tree",
	"trouble",
	"true",
	"trust",
	"try",
	"tuesday",
	"turn",
	"twelve",
	"twenty",
	"two",
	"type",
	"under",
	"understand",
	"union",
	"unit",
	"unite",
	"university",
	"unless",
	"until",
	"up",
	"upon",
	"use",
	"usual",
	"value",
	"various",
	"very",
	"video",
	"view",
	"village",
	"visit",
	"vote",
	"wage",
	"wait",
	"walk",
	"wall",
	"want",
	"war",
	"warm",
	"wash",
	"waste",
	"watch",
	"water",
	"way",
	"we",
	"wear",
	"wednesday",
	"wee",
	"week",
	"weigh",
	"welcome",
	"well",
	"west",
	"what",
	"when",
	"where",
	"whether",
	"which",
	"while",
	"white",
	"who",
	"whole",
	"why",
	"wide",
	"wife",
	"will",
	"win",
	"wind",
	"window",
	"wish",
	"with",
	"within",
	"without",
	"woman",
	"wonder",
	"wood",
	"word",
	"work",
	"world",
	"worry",
	"worse",
	"worth",
	"would",
	"write",
	"wrong",
	"year",
	"yes",
	"yesterday",
	"yet",
	"you",
	"young",
	"zoo",
	"zebra"
];

let randomLetters = [
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	" "
];

let pi = "3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282" + 
	"3066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867" + 
	"8316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259" + 
	"0360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752" + 
	"7248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051" + 
	"3200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196" + 
	"0864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035" + 
	"2619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321" + 
	"7122680661300192787661119590921642019";


function generateText() {
	let output = "";
	
	if (settings.baseGenerator === "common") {
		for (let i = 0; i < settings.generationCount; i++) {
			let j = commonWords[Math.floor(Math.random() * commonWords.length)] + " ";
			if (settings.randomUppercase && Math.random() >= 0.75) {
				j = j.charAt(0).toUpperCase() + j.slice(1);
			}
			
			output += j;
		}
	} else if (settings.baseGenerator === "randomLetters") {
		for (let i = 0; i < settings.generationCount; i++) {
			let j = randomLetters[Math.floor(Math.random() * randomLetters.length)];
			if (settings.randomUppercase && Math.random() >= 0.80) {
				j = j.toUpperCase();
			}
			
			output += j;
		}
	} else if (settings.baseGenerator === "pi") {
		output = pi.substring(0, settings.generationCount);
	} else if (settings.baseGenerator === "custom") {
		output = settings.customText;
	}
	
	output = output.trim().substring(0, 500).replace(/[\n\r\t]/g, " ");
	
	if (output.length < 2)
		return generateText();
	
	return output;
}