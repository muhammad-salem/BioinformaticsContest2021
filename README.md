# Bioinformatics Contest 2021


More information about the contest can be found at this [link](https://stepik.org/course/91751/info). The contest was organised by [Bioinformatics Institute](https://bioinf.me/)


### compile code 

```sh
tsc
```

## Deal with memory for node

 - for node
	```sh
	export NODE_OPTIONS="--max-old-space-size=24384"
	```

 - for linux (apt/debian/ubuntu)
	```sh
	sudo apt install zram-tools zram-config 
	sudo zramctl -f -s 30GB
	sudo  mkswap /dev/zram1
	sudo swapon -p 5 /dev/zram1
	```


## Qualification Round

| Example | Run Command |
| -------------------- | - |
| 1.1:1 A + B | node dist/index.js a |
| 1.1:2 Finding a Motif in DNA | node dist/index.js b |
| 2.2.1 Epigenomic Marks 2 (Small version) | node dist/index.js c-1 |
| 2.2.2 Epigenomic Marks 2 (Large version) | node dist/index.js c-2 |
| 2.3.1 Metabolite Annotation (Test #1) | node dist/index.js d-1 |
| 2.3.2 Metabolite Annotation (Test #2) | node dist/index.js d-2 |
| 2.3.3 Metabolite Annotation (Test #3) | node dist/index.js d-3 |
| 2.3.4 Metabolite Annotation (Test #4) | node dist/index.js d-4 |
| 2.3.5 Metabolite Annotation (Test #5) | node dist/index.js d-5 |
| 2.4.1 Diagnosis | - |


## Final Round

| Genotype Imputation | Run Command |
| -------------------- | - |
| 1 | - | 


| Causative Mutation | Run Command |
| -------------------- | - |
| 1 | - | 


| Superspreaders | Run Command |
| -------------------- | - |
| Test #1 | node dist/index.js 341 |
| Test #2 | node dist/index.js 342 |
| Test #3 | node dist/index.js 343 |
| Test #4 | node dist/index.js 344 |
| Test #5 | node dist/index.js 345 |
| Test #6 | node dist/index.js 346 |
| Test #7 | node dist/index.js 347 |
| Test #8 | node dist/index.js 348 |

| Minor Haplotype | Run Command |
| -------------------- | - |
| 1 | - | 


| Isoform Matching | Run Command |
| -------------------- | - |
| Test #00 | node dist/index.js 5-easy/00 |
| Test #10-welcome | node dist/index.js 5-easy/10-welcome |
| Test #20-mouse-simple-exact | node dist/index.js 5-easy/20-mouse-simple-exact |
| Test #30-mouse-exact | node dist/index.js 5-easy/30-mouse-exact |
| Test #35-mouse-inexact | node dist/index.js 5-easy/35-mouse-inexact |
| Test #55-huge-inexact' | node dist/index.js 5-easy/55-huge-inexact' |
| Test #60-huge-inexact | node dist/index.js 5-easy/60-huge-inexact |
