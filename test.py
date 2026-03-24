from typing import Protocol
import random
import uuid

EXIST = []
class UUID(Protocol):
    pass
def uuid4_() -> UUID:
    num = '123456789'
    char = 'qwertyuopasdfghjklzxcvbnm'
    final = ''
    s1 = ''
    s2 = ''
    s3 = ''
    s4 = ''
    s5 = ''
    for _ in range(4):
        rn = random.choice(num)
        rc = random.choice(char)

        s1 += rn + rc
        if len(s1) == 8:
            s1 += '-'
            for _ in range(4):
                rn = random.choice(num)
                rc = random.choice(char)

                s2 += rn + rc
                if len(s2) == 4:
                    s2+='-'
                    for _ in range(4):
                        rn = random.choice(num)
                        rc = random.choice(char)

                        s3 += rn + rc
                        if len(s3) == 4:
                            s3+='-'
                            for _ in range(4):
                                rn = random.choice(num)
                                rc = random.choice(char)

                                s4 += rn + rc
                                if len(s4) == 4:
                                    s4+='-'
                                    for _ in range(4):
                                        rn = random.choice(num)
                                        rc = random.choice(char)

                                        s5 += rn + rc
                                        if len(s5) == 12:
                                            break
    final = s1+s2+s3+s3+s5
    if final in EXIST:
        uuid4_()
    EXIST.append(final)
    print(final)
    return final


def removeSpace(string: str) -> str:
    string = string.strip()
    for char in string:
        if char == ' ':
            string = string.replace(char, '')
    
    return string
if __name__ == '__main__':
    string = '      hi      there        I         am          Ju    li   us   .'
    new_s = removeSpace(string)
    print(new_s)

    string = 'L   e   e   t   c  o  d  e  !'
    new_s = removeSpace(string)
    print(new_s)

    
