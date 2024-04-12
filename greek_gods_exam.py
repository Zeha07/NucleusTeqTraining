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


