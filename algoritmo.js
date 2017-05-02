var HV;
var T;
var TF;
var TPLL;
var TPS;
var NPS;
var ITO;
var SS;
var NT;
var STA;
var SLL;
var STO;
var TPU;
var CEPO;
var CEPU;
var CTSPU;
var PPU;
var NP;

function init_variables(tiempo_fin){
    HV = 99999999999999999999;
    T = 0;
    TF = tiempo_fin;
    TPLL = 0;
    TPS = [];
    NPS = [];
    ITO = [];
    SS = [];
    NT = [];
    STA = [];
    SLL = [];
    STO = [];
    TPU = 0;
    CEPO = 0;
    CEPU = 0;
    CTSPU = 0;
    PPU = 0;
    NP = 0;
}

function asignar_Tiempos(cTPS){//, cNPS){
  for (var i=0; i<cTPS; i++){
    TPS.push(HV);
    NPS.push(0);
    ITO.push(0);
    SS.push(0);
    NT.push(0);
    STA.push(0);
    SLL.push(0);
    STO.push(0);
  }
  //for (i=0, i<cNPS, i++){
  //  NPS[i]=HV;
  //}
}

function buscarMenorTPS(){
  var j=0;
  for (i=0;i<NP;i++){
    if(TPS[j]>TPS[i]){
      j=i;
    }
  }
  return j;
}

function buscarMenorCola(){
  var j=0;
  for (i=0;i<NP;i++){
    if(NPS[j]>NPS[i]){
      j=i;
    }
  }
  return j;
}

function getTA() {
  var R = Math.random();
  return Math.pow(Math.pow(6, 1.0893)*R, (1/R));
}

function getIA() {
  var R = Math.random();
  return Math.pow(R, (1/0.88277))*6 + 6;
}

function hayVaciamiento(){
  var rep = true;
  var i = 0;
  while (rep){
    if(NPS[i]>0){
      TPLL=HV;
      return true;
    } else {
      i++;
      if(i<NP){
        //cicla otra vez
      } else {
        return false;
      }
    }
  }
}

function calculos(){
  for(var i=0;i<NP;i++){
    TPU += STA[i];
    CEPO += STO[i]*84*(1/3600)*(1/1000)*(4.5/1000);//ms
    CEPU += STA[i]*290*(1/3600)*(1/1000)*(4.5/1000);//ms
  };
  console.log("CEPO = "+ CEPO);
  console.log("CEPU = "+ CEPU);
  var CTP = NP * 4900;
  CT = CEPU + CEPO;
  console.log("CT en TF[" + TF + "] = "+ CT);
  //CTSPU = CT/TPU;
  CTSPU = CT*(1000/T);
  PPU = (TPU/(T*NP))*100;
}

function mostrarResultados(){
  console.log("Tiempo total uso = "+ TPU);
  console.log("CTSPU = "+ CTSPU);
  console.log("Costo al mes = "+ (CTSPU*3600*24*30));
  console.log("PPU = "+ PPU + "%");
}

function mostrarEstado(i){
  console.log("T = "+T);
  console.log("TPLL = "+TPLL);
  console.log("TPS["+i+"] = "+TPS[i]);
  console.log("NPS["+i+"] = "+NPS[i]);
  console.log("NT = "+NT);
  console.log("STO = ["+STO + "]");
}

function calcularSTO(){
  for (i=0;i<NP;i++){
    STO[i] = T - STA[i];
  }
}

function main(cProc, final){
  init_variables(final);
  NP=cProc;
  asignar_Tiempos(NP);
  var repetir = true;
  while (repetir){
    var i = buscarMenorTPS();
    if(TPS[i] < TPLL){
      console.log("-------------");
      console.log("Desencola");
      mostrarEstado(i);
      T = TPS[i];
      calcularSTO();
      NPS[i]--;
      if (NPS[i]>0){
        //STO[i] += (T - ITO[i]);
        STO[i] = (T - STA[i]);
        console.log("-------------");
        console.log("Atiende");
        mostrarEstado(i);
        TA = getTA();
        TPS[i] = T +TA;
        STA[i] += TA;
      } else {
        console.log("Inicio tiempo ocioso");
        ITO[i] = T;
        TPS[i] = HV;
      }
      SS[i] += T;
      NT[i] += 1;
    } else {
      console.log("-------------");
      console.log("Llega tarea");
      mostrarEstado(i);
      T = TPLL;
      IA = getIA();
      TPLL = T +IA;
      i = buscarMenorCola();
      NPS[i]++;
      SLL[i] += T;
      if (NPS[i]==1){
        //STO[i] += (T - ITO[i]);
        STO[i] = (T - STA[i]);
        console.log("-------------");
        console.log("Atiende");
        mostrarEstado(i);
        TA = getTA();
        TPS[i] = T + TA;
        STA[i] += TA;
      } else {
        console.log("Hace cola");
      }
    }
    console.log("-------------");
    console.log("Fin ciclo");
    mostrarEstado(i);
    if (T >=TF){
      if (hayVaciamiento()){
        repetir=true;
      } else {
        repetir = false;
      }
    }
  }
  calcularSTO();
  calculos();
  mostrarResultados();
}
