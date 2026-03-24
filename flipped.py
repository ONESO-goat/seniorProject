race = "racecar"

# check if flipped equals with out using reverse
cheese = list(i for i in race)
i = -1
update = 1
for index in range(int(len(cheese) / 2)):
    cheese[i], cheese[index] = cheese[index], cheese[i]
    print(f"CHANGE {update}", cheese)

    update+=1
    i-=1

final = "".join([i for i in cheese])
print(final == race)

    