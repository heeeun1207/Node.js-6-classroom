const https = require('https');
const { type } = require('os');

const getPokemonData = (url, pokemonName) => {
  if( typeof (url) === "string" && typeof (pokemonName) === "string"){
//위의 조건식이 모두 문자열이여야만 한다는 조건을 걸었다.
  let assembleUrl = url + pokemonName;
  return new Promise((resolve , reject )=> {
    //반환이 Promise 이므로 , resolve()함수가 호출될 때까지는 대기한다.
    //아래의 body에 데이터 조각들이 차곡차곡 모여 resolve() 함수가 호출될 때까지 대기한다.
    https.get(assembleUrl, (res)=>{
      let body = '';
      //on() 이벤트리스너로 주소로부터 데이터를 받는다.
      //chuck 라고 작성되어있는 이유는 데이터를 조각조각 받기 때문으로 
      // 데이터를 조각조각 받아서 body에 저장한다. 
      res.on('data', (chunk)=> {
        body += chunk;
        //body = body + chunck; 와 같다 
      });

      res.on('end', ()=> {
        let data = JSON.parse(body);
        //fullfilled(이행)할 때 차곡차곡 쌓은 body 를 resolve() 함수에 넘겨준다.
        resolve(data);
      });
      //아래는 단순 에러 이벤트 처리 
    }).on('error',(error)=> {
      reject(error);
    });

  });
  } else {
    console.log("두개의 매개변수는 모두 문자열을 요구합니다.");

  }
};
 const main = async ()=> {
  console.time("time-check"); // console 메서드에는 시간을 측정하는 기능이 있다. 
  try {
    const pokemonName = 'bulbasaur'; //이상해씨 //charmander 파이리 //squirtle 꼬부기 
    const pokemonData = await getPokemonData("https://pokeapi.co/api/v2/pokemon/", pokemonName);
    //main()함수는 본래 비동기 함수가 아니지만,
    //async 키워드를 사용하여 비동기 함수로 만들었으므로 
    //await 키워드를 사용하여 비동기 함수를 동기적으로 사용할 수 있다....

    const types = await pokemonData.types.map(typeInfo => typeInfo.type.name);
    //.map() 메서드로 피카츄의 몬스터 타입을 가져오는 것도 await을 작성해 순차적으로 실행되는
    // 가독성을 확보했다 . 
    console.log(`Name: ${pokemonData.name}`);
    console.log(`Types: ${types}`);
  }catch (error){
    console.error('Error fetching data from Poke API', error);
  }
  console.timeEnd("time-check"); // "time-check" 라는 라벨 (레이블) 을 붙여 얼마나 시간이 걸렸는지 확인!
};
main();