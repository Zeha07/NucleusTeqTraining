import pandas as pd 

God= pd.read_csv('/content/drive/MyDrive/python project/greek_god.txt')
God.to_csv('/content/drive/MyDrive/python project/greek_god.csv')

god_csv = pd.read_csv('/content/drive/MyDrive/python project/greek_god.csv')
god_csv
#Result god_csv
#	Unnamed: 0	God	Domain	Symbol	Age
#0	0	Zeus	King of the Gods	Thunderbolt	10000
#1	1	Poseidon	God of the Sea	Trident	9000
#2	2	Hera	Queen of the Gods	Peacock	8500
#3	3	Athena	Goddess of Wisdom	Owl	8000
#4	4	Hades	God of the Underworld	Helmet	9500

Goddess = pd.read_csv('/content/drive/MyDrive/python project/greek_goddess.txt')
Goddess.to_csv('/content/drive/MyDrive/python project/greek_goddess.csv')
goddess_csv= pd.read_csv('/content/drive/MyDrive/python project/greek_goddess.csv')
goddess_csv

# 	Unnamed: 0	Goddess	Domain	Symbol	Age
# 0	0	Aphrodite	Goddess of Love	Dove	7000
# 1	1	Artemis	Goddess of the Hunt	Bow and Arrow	7500
# 2	2	Demeter	Goddess of Agriculture	Wheat	8000
# 3	3	Hestia	Goddess of the Hearth	Fire	8200
# 4	4	Persephone	Queen of the Underworld	Pomegranate	7800


merged_csv = pd.merge(god_csv,goddess_csv,on='Age')
merged_csv

# 	Unnamed: 0_x	God	Domain_x	Symbol_x	Age	Unnamed: 0_y	Goddess	Domain_y	Symbol_y
# 0	3	Athena	Goddess of Wisdom	Owl	8000	2	Demeter	Goddess of Agriculture	Wheat

god_c= god_csv[god_csv['Age']>8000]
god_c.sort_values(['Age'] , ascending=[False])
god_c

# 	Unnamed: 0	God	Domain	Symbol	Age
# 0	0	Zeus	King of the Gods	Thunderbolt	10000
# 1	1	Poseidon	God of the Sea	Trident	9000
# 2	2	Hera	Queen of the Gods	Peacock	8500
# 4	4	Hades	God of the Underworld	Helmet	9500
#no domain same hence performing outer join
merged2_csv = pd.merge(god_csv , goddess_csv,on='Domain' , how ='outer')
merged2_csv

# 	Unnamed: 0_x	God	Domain	Symbol_x	Age_x	Unnamed: 0_y	Goddess	Symbol_y	Age_y
# 0	0.0	Zeus	King of the Gods	Thunderbolt	10000.0	NaN	NaN	NaN	NaN
# 1	1.0	Poseidon	God of the Sea	Trident	9000.0	NaN	NaN	NaN	NaN
# 2	2.0	Hera	Queen of the Gods	Peacock	8500.0	NaN	NaN	NaN	NaN
# 3	3.0	Athena	Goddess of Wisdom	Owl	8000.0	NaN	NaN	NaN	NaN
# 4	4.0	Hades	God of the Underworld	Helmet	9500.0	NaN	NaN	NaN	NaN
# 5	NaN	NaN	Goddess of Love	NaN	NaN	0.0	Aphrodite	Dove	7000.0
# 6	NaN	NaN	Goddess of the Hunt	NaN	NaN	1.0	Artemis	Bow and Arrow	7500.0
# 7	NaN	NaN	Goddess of Agriculture	NaN	NaN	2.0	Demeter	Wheat	8000.0
# 8	NaN	NaN	Goddess of the Hearth	NaN	NaN	3.0	Hestia	Fire	8200.0
# 9	NaN	NaN	Queen of the Underworld	NaN	NaN	4.0	Persephone	Pom


