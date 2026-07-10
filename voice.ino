int btn[6] = {2,3,4,5,6,7};

bool collecting = false;
unsigned long startTime;
const unsigned long waitTime = 1000;

int latched[6] = {0,0,0,0,0,0};

String sentence = "";
String currentWord = "";

void setup() {
  Serial.begin(9600);

  for (int i = 0; i < 6; i++) {
    pinMode(btn[i], INPUT_PULLUP);
  }

  Serial.println("BRAILLE READY");
}

void loop() {

  // Read Braille buttons
  for (int i = 0; i < 6; i++) {

    if (digitalRead(btn[i]) == LOW) {

      if (!collecting) {
        collecting = true;
        startTime = millis();
      }

      latched[i] = 1;
    }
  }

  // Wait for full Braille pattern
  if (collecting && millis() - startTime >= waitTime) {

    String pattern = "";

    for (int i = 0; i < 6; i++) {
      pattern += latched[i] ? '1' : '0';
    }

    // ---------- SPACE ----------
    if (pattern == "000001") {

      Serial.print("WORD:");
      Serial.println(currentWord);

      sentence += currentWord + " ";

      currentWord = "";
    }

    // ---------- FULL STOP ----------
    else if (pattern == "010011") {

      sentence += currentWord;

      sentence.trim();

      sentence += ".";

      Serial.print("SENTENCE:");
      Serial.println(sentence);

      sentence = "";

      currentWord = "";
    }

    // ---------- LETTER ----------
    else {

      char c = brailleToChar(pattern);

      if (c != '?') {

        currentWord += c;

        Serial.print("LETTER:");
        Serial.println(c);
      }
    }

    // Reset
    for (int i = 0; i < 6; i++) {
      latched[i] = 0;
    }

    collecting = false;
  }
}

char brailleToChar(String p) {

  if (p=="100000") return 'A';
  if (p=="110000") return 'B';
  if (p=="100100") return 'C';
  if (p=="100110") return 'D';
  if (p=="100010") return 'E';
  if (p=="110100") return 'F';
  if (p=="110110") return 'G';
  if (p=="110010") return 'H';
  if (p=="010100") return 'I';
  if (p=="010110") return 'J';
  if (p=="101000") return 'K';
  if (p=="111000") return 'L';
  if (p=="101100") return 'M';
  if (p=="101110") return 'N';
  if (p=="101010") return 'O';
  if (p=="111100") return 'P';
  if (p=="111110") return 'Q';
  if (p=="111010") return 'R';
  if (p=="011100") return 'S';
  if (p=="011110") return 'T';
  if (p=="101001") return 'U';
  if (p=="111001") return 'V';
  if (p=="010111") return 'W';
  if (p=="101101") return 'X';
  if (p=="101111") return 'Y';
  if (p=="101011") return 'Z';

  return '?';
}