window.CH = {
  id:'06',
  intro:'관사(artículo)는 명사 앞에 붙어 그 명사가 "이미 아는 것"인지 "처음 언급하는 것"인지를 알려줍니다. 명사의 성과 수에 반드시 일치시키세요.',
  sections:[
    {type:'table', title:'6.1 정관사 (artículo definido) — 영어의 the', html:'<p>이미 알고 있거나, 특정되는, 또는 일반적인 의미의 사람·사물 앞에 씁니다.</p>', head:['','단수','복수'], es:[1,2],
      rows:[['남성','el libro','los libros'],['여성','la casa','las casas']],
      after:`<div class="callout warn"><div class="em">⚠️</div><div><b>강세가 있는 a-/ha-로 시작하는 여성 단수 명사</b> 앞에서는 발음 충돌을 피하려고 la 대신 <b>el</b>을 씁니다: ==el agua== (물), ==el águila== (독수리), ==el aula== (교실), ==el hacha== (도끼), ==el hambre== (배고픔). 하지만 여성 명사이므로 형용사는 여성형: el agua ==fría==. 복수는 다시 las: ==las aguas==, ==las aulas==.</div></div>
      <p><b>축약형</b>: a + el = ==al== (Voy al cine), de + el = ==del== (el libro del profesor). la, los, las와는 축약하지 않습니다.</p>`},
    {type:'examples', title:'정관사의 용법', items:[
      {es:'El sol sale por el este.', ko:'① 유일한 사람·사물: 태양은 동쪽에서 뜬다.'},
      {es:'La presidenta de la empresa es muy joven.', ko:'① 유일하게 특정되는 사람'},
      {es:'Cierra la puerta, por favor.', ko:'② 대화 중 이미 명확한 사물: (그) 문 좀 닫아 줘.'},
      {es:'El profesor de español es de Madrid.', ko:'② 서로 알고 있는 그 선생님'},
      {es:'Los gatos son independientes.', ko:'③ 일반적인 의미: 고양이(라는 동물)는 독립적이다.'},
      {es:'Me gusta el café.', ko:'③ 일반적 의미: 나는 커피를 좋아한다.'},
      {es:'El lunes tengo un examen.', ko:'④ 요일 앞: 월요일에 (전치사 없이)'},
      {es:'Son las tres de la tarde.', ko:'⑤ 시간 앞'},
      {es:'El señor García no está.', ko:'⑥ 3인칭으로 언급하는 호칭 앞 (직접 부를 때는 ¡Señor García!)'},
      {es:'Me lavo las manos.', ko:'⑦ 신체 부위·옷 (소유형용사 대신)'},
    ]},
    {type:'table', title:'6.2 부정관사 (artículo indefinido) — 영어의 a / some', html:'<p>처음 언급하거나 불특정한 사람·사물 앞에 씁니다. 복수형 unos/unas는 "몇몇의, 대략"의 뜻입니다.</p>', head:['','단수','복수'], es:[1,2],
      rows:[['남성','un libro','unos libros'],['여성','una casa','unas casas']],
      after:'<p>강세 a-/ha- 여성 단수 명사 앞에서는 una 대신 <b>un</b>: ==un águila==, ==un aula==, ==un hacha==. (un área도 자주 쓰임)</p>'},
    {type:'examples', title:'부정관사의 용법', items:[
      {es:'Hay un libro sobre la mesa.', ko:'처음 언급: 탁자 위에 책이 한 권 있다.'},
      {es:'Tengo una hermana y dos hermanos.', ko:'수량(하나)을 나타냄'},
      {es:'Necesito unos zapatos nuevos.', ko:'복수: 새 신발 (한 켤레)'},
      {es:'Tiene unos treinta años.', ko:'unos + 숫자 = 대략: 서른 살쯤'},
      {es:'Vivo en una ciudad pequeña.', ko:'불특정한 어떤 도시'},
    ]},
    {type:'compare', title:'부정관사를 쓰지 않는 경우 vs 쓰는 경우', cols:[
      {title:'❌ 쓰지 않음', html:`<ul><li><b>직업·종교·국적·사상</b>을 ser 뒤에서 말할 때:<br>[[Soy profesor.]] [[Ana es médica.]] [[Son católicos.]] [[Es socialista.]]</li><li>일반적인 사항의 <b>직접목적어</b>(특히 소유·착용):<br>[[Tengo coche.]] [[¿Tienes hermanos?]] [[No llevo gafas.]] [[Buscamos piso.]]</li><li>otro, medio, cien, mil 앞: [[otro día]] (✗ un otro), [[media hora]], [[mil euros]]</li></ul>`},
      {title:'✅ 씀', html:`<ul><li>직업 명사가 <b>형용사를 동반</b>할 때:<br>[[Es un profesor excelente.]] [[Es una médica muy famosa.]]</li><li><b>직업으로 신원을 확인·소개</b>할 때:<br>[[¿Quién es Juan? — Es un médico del hospital.]]</li><li><b>수량</b>을 말하거나 <b>형용사</b>와 함께 올 때:<br>[[Tengo un coche rojo.]] [[Tengo dos hermanos.]] [[Llevo unas gafas nuevas.]]</li></ul>`},
    ]},
    {type:'table', title:'정리: el / la / los / las / un / una / unos / unas', head:['상황','관사','예'], es:[2],
      rows:[['이미 아는 것, 유일한 것','정관사','el sol, la puerta (그 문)'],['일반적 의미 전체','정관사','Los perros son fieles.'],['처음 언급, 하나','부정관사','Hay una farmacia aquí.'],['대략의 수','unos / unas','unos veinte estudiantes'],['직업·국적 (ser 뒤)','없음','Es ingeniera.'],['직업 + 형용사','부정관사','Es una ingeniera brillante.']]},
  ],
  exercises:[
    {type:'fill', title:'알맞은 부정관사 쓰기 (un / una / unos / unas)', items:[
      {q:'___ coche', a:'un'},{q:'___ casa', a:'una'},{q:'___ problema', a:'un'},{q:'___ zapatos', a:'unos'},{q:'___ gafas', a:'unas'},{q:'___ mano', a:'una'},{q:'___ aula', a:'un'},{q:'___ ciudad', a:'una'},{q:'___ días', a:'unos'},{q:'___ canción', a:'una'},{q:'___ águila', a:'un'},{q:'___ mapas', a:'unos'},
    ]},
    {type:'fill', title:'알맞은 정관사 쓰기 (el / la / los / las)', items:[
      {q:'___ agua está fría.', a:'El'},{q:'___ manos', a:'las'},{q:'___ idioma', a:'el'},{q:'___ noches', a:'las'},{q:'___ lunes', a:'el'},{q:'___ foto', a:'la'},{q:'___ problemas', a:'los'},{q:'___ universidad', a:'la'},{q:'___ hambre', a:'el'},{q:'___ aguas', a:'las'},{q:'___ sofá', a:'el'},{q:'___ flores', a:'las'},
    ]},
    {type:'mc', title:'올바른 형태 고르기', items:[
      {q:'Mi padre es ___ médico.', opts:['un','—(관사 없음)','el'], a:1, exp:'ser + 직업: 관사 없음'},
      {q:'Mi padre es ___ médico muy bueno.', opts:['un','—(관사 없음)','el'], a:0, exp:'형용사가 붙으면 부정관사'},
      {q:'¿Tienes ___ hermanos? — Sí, tengo ___ hermano.', opts:['unos / un','— / un','los / el'], a:1},
      {q:'Voy ___ cine esta noche.', opts:['a el','al','a la'], a:1, exp:'a + el = al'},
      {q:'Es el libro ___ profesor.', opts:['de el','del','de la'], a:1},
      {q:'___ sol sale por el este.', opts:['Un','El','Los'], a:1, exp:'유일한 것'},
      {q:'Tiene ___ cuarenta años.', opts:['los','unos','un'], a:1, exp:'unos + 숫자 = 대략'},
      {q:'Hay ___ farmacia en esta calle.', opts:['la','una','las'], a:1, exp:'처음 언급'},
      {q:'___ gatos duermen mucho.', opts:['Unos','Los','El'], a:1, exp:'일반적 의미 전체'},
      {q:'Nos vemos ___ viernes.', opts:['en el','el','a el'], a:1, exp:'요일: 전치사 없이 정관사만'},
      {q:'Quiero ___ otro café.', opts:['un','—(관사 없음)','el'], a:1, exp:'otro 앞에는 부정관사를 쓰지 않음'},
      {q:'Me duele ___ cabeza.', opts:['mi','la','una'], a:1, exp:'신체 부위는 정관사'},
    ]},
    {type:'classify', title:'관사가 필요한가요?', instr:'문장을 보고 밑줄 자리에 관사가 필요한지(un/una) 필요 없는지 분류하세요.', buckets:['un / una 필요','관사 없음'], items:[
      {t:'Es ___ abogada.',b:1},{t:'Es ___ abogada famosa.',b:0},{t:'Soy ___ estudiante.',b:1},{t:'Tengo ___ coche nuevo.',b:0},{t:'No tengo ___ coche.',b:1},{t:'Hay ___ banco cerca.',b:0},{t:'Son ___ budistas.',b:1},{t:'Compré ___ libro ayer.',b:0}]},
  ]
};
