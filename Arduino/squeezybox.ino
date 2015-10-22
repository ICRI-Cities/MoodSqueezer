#include <SPI.h>
#include <WiFi.h>

int numElements = 6;
int led = 3;
int balls[] = {A0,A1,A2,A3,A4,A5};  //b1, b2, b3, b4, b5, b6
char squeezeData[100];

unsigned long pressTime;
int floorLevel = 1;  //the building level

//network variables
char ssid[] = "CS66GS";
char password[] = "WIRELESS_PETE";
int status = WL_IDLE_STATUS;     // the Wifi radio's status

//server variables
WiFiClient client; //Initialise client library
char server[]="icri-nodejs.cs.ucl.ac.uk";  //URL of floor server
int port = 7654;
long pingDelay = 10000;
long lastPing = 0;

//squeeze variables
long startTimes[] = {0,0,0,0,0,0};
long endTimes[] = {0,0,0,0,0,0};
long inProgress[] = {false,false,false,false,false,false};
int squeezeType[] = {0,0,0,0,0,0};

void setup(){
  Serial.begin(9600);
  //while(!Serial);
  
  pinMode(led, OUTPUT);
  
  startConnection();
}

void loop(){
  
  //ping server
  if(client.connected()){
    if(millis() - lastPing > pingDelay){
      pingServer();
      lastPing = millis();
    }
  }
  
  //check for squeezes
  for(int i=0; i<numElements; i++){
    int ballVal = analogRead(balls[i]);
    //Serial.println("ballVal "+(String)i+" = "+(String)ballVal);
    if(ballVal > 800){
      squeezeType[i] = 3; //big squeeze
      digitalWrite(led, LOW);
    }else if(ballVal > 600 && squeezeType[i]<3){  //medium squeeze
      squeezeType[i] = 2;
      digitalWrite(led, LOW);
    }else if(ballVal > 400 && squeezeType[i]<2){  //small squeeze
      squeezeType[i] = 1;
      digitalWrite(led, LOW);
      if(!inProgress[i] && (millis()-endTimes[i])>1000){ //1 sec since last ball squeeze
        startTimes[i] = millis();
        inProgress[i] = true;
      }
    }else{
      if(inProgress[i]){
        digitalWrite(led, LOW);
        endTimes[i] = millis();
        int duration = endTimes[i] - startTimes[i];
        postToServer(i, duration, squeezeType[i]);
        inProgress[i] = false;
      }else{
        digitalWrite(led, HIGH);
        squeezeType[i] = 0;
      }
    }
  }
}

void startConnection(){
  if(!connectToWifi()){
    wifiError();
  }
  if(!connectToServer()){
      serverError();
  }
}

boolean connectToWifi(){
  int tries = 0;
  while(status != WL_CONNECTED && tries < 10){
    
    Serial.print("Connecting to wifi. Attempt ");
    Serial.print(tries+1);
    Serial.println("...");
    
    status = WiFi.begin(ssid, password);
    delay(5000);
    tries++;
  }
  
  if(status != WL_CONNECTED){
    Serial.println("Connection to wifi failed");
    return false;
  }else{
    Serial.println("connected to wifi");
    Serial.println(WiFi.localIP());
  }
  return true;
}

boolean connectToServer(){
  int tries = 0;
  while(!client.connected() && tries < 10){
    Serial.print("Connecting to server. Attempt ");
    Serial.print(tries+1);
    Serial.println("...");
    
    client.connect(server, port);
    tries++;
  }
  
  if(!client.connected()){
     Serial.println("Connection to server failed");
    return false;
  }else{
    Serial.println("connected to server");
  }
  return true;
}

void serverError(){
  //flash LED 6 times fast
  while(true){
    digitalWrite(led, HIGH);
    delay(100);
    digitalWrite(led, LOW);
    delay(100);
  }
}

void wifiError(){
  //flash LED 3 times fast
  while(true){
    digitalWrite(led, HIGH);
    delay(100);
    digitalWrite(led, LOW);
    delay(100);
  }
}

void serverErrorSignal(){
  //flash LED 4 times fast
  for(int i=0; i<4; i++){
    digitalWrite(led, HIGH);
    delay(100);
    digitalWrite(led, LOW);
    delay(100);
  }
}

void wifiErrorSignal(){
  //flash LED 2 times fast
  for(int i=0; i<2; i++){
    digitalWrite(led, HIGH);
    delay(100);
    digitalWrite(led, LOW);
    delay(100);
  }
}

void postToServer(int ballNum, int duration, int intensity){ 
  Serial.println("Sending update to server"); 
  squeezeData[0] = 'S';
  squeezeData[1] = '1';
  squeezeData[2] = ballNum + '0';  //to channge to ascii char
  squeezeData[3] = intensity + '0';
  squeezeData[4] = '1';  //placeholder for duration if needed
  squeezeData[5] = '\0';  //string terminator
  Serial.println(squeezeData);
  
  if(status == WL_CONNECTED){
    if(client.connected()){
      Serial.println("uploading...");
      client.println(squeezeData);
      delay(500);
    }else{
      Serial.println("reconnecting...");
      client.flush();
      client.stop();
      client.connect(server, port);
      
      if(client.connected()){
        Serial.println("uploading...");
        client.println(squeezeData);
        delay(500);
      }else{
        Serial.println("Lost connection to server");
        serverErrorSignal();
      }
    }
  }else{
    Serial.println("Lost wifi connection");
    wifiErrorSignal();
  }
}


void pingServer(){
  Serial.println("pinging server...");
  client.write("p");
}
