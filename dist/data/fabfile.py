import csv
import json

def parseData(csv_file):
    """Parse data into usable JSON"""
 
    # formatter
    def format_str(string):
        return string.replace(" ", "_").replace("/", "_").replace("'", "").lower().strip()
 
    # open the file
    with open("data.csv", "rb") as data:
        reader = csv.reader(data, delimiter=",")
        
        the_big_list = []
        
        reader.next()
        
        for i, row in enumerate(reader):
            d = {}

            d['id'] = i
            
            name = row[0]
            d['name'] = name

            chamber = row[1]
            d['chamber'] = format_str(chamber)

            party = row[2]
            d['party'] = format_str(party)

            district = row[3]
            d['district'] = district.strip()

            city = row[4]
            d['city'] = city

            sex = row[5]
            d['sex'] = format_str(sex)

            race = row[6]
            d['race'] = format_str(race)

            term_limit = row[7]
            d['term_limit'] = term_limit.strip()

            dob = row[8]
            d['dob'] = dob.strip()

            # age = row[9]

            marital_status = row[10]
            d['marital'] = format_str(marital_status)

            occupation = row[11]
            d['occupation'] = occupation

            education = row[12]
            d['education'] = format_str(education)

            phone = row[13]
            d['phone'] = phone.strip().replace("(", "").replace(") ", "-")

            email = row[14]
            d['email'] = email.strip()

            sb_1616 = row[15]
            d['sb1616'] = sb_1616.lower().strip()

            sb_1552 = row[16]
            d['sb1552'] = sb_1552.lower().strip()

            hb_3210 = row[17]
            d['hb3210'] = hb_3210.lower().strip()

            hb_3208 = row[18]
            d['hb3208'] = hb_3208.lower().strip()

            sb_1577 = row[19]
            d['sb1577'] = sb_1577.lower().strip()

            sb_1604 = row[20]
            d['sb1604'] = sb_1604.lower().strip()

            sb_1606 = row[21]
            d['sb1606'] = sb_1606.lower().strip()

            sjr_68 = row[22]
            d['sjr68'] = sjr_68.lower().strip()

            hb_3231 = row[23]
            d['hb3231'] = hb_3231.lower().strip()

            hb_3218 = row[24]
            d['hb3218'] = hb_3218.lower().strip()
            
            hb_2472 = row[25]
            d['hb2472'] = hb_2472.lower().strip()
            
            sb_1257 = row[26]
            d['sb1257'] = sb_1257.lower().strip()
            
            sjr_4 = row[27]
            d['sjr4'] = sjr_4.lower().strip()
            
            the_big_list.append(d)
            
    with open("data.json", "wb") as outfile:
        outfile.write(json.dumps(the_big_list))