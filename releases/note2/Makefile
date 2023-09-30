static = ~/Downloads/NOTE-wot-scripting-api-20230930.html

### 1. edit index.html
### 2. generate a static HTML (e.g., NOTE-wot-scripting-api-20230930.html) using ReSpec
### 3. then use the following "update target" (by "make update") to get static.html and Overview.html
update:
	mv $(static) static.html
	cp static.html Overview.html; tidy -i -m Overview.html
	cp Overview.html backup.html; ./fix-id.pl backup.html > Overview.html
