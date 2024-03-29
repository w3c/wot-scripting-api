# How to Edit the Draft for Publication

In each sub directory, you can find the relevant files for the publication process.
In general, you should always consult the W3C Guide page at <https://www.w3.org/Guide>.

## Checklist

* Make sure that you update the recent specification changes

## Files

* Overview.html - static HTML for publication
* diff.html - diff between the previous published version and Overview.html
* index.html - same as the index.html at <https://w3c.github.io/wot-scripting-api/> ([or at the root of the repository](../index.html)), except for changing the respec option from ED to the version you are aiming at such as CR, WD, etc.
* static.html - static HTML generated by ReSpec from the index.html above

## How to Generate Each File

Overview.html is generated as follows:

1. Copy index.html from [the root of the repository](../index.html).
2. Change `specStatus` to `"NOTE"` from `"ED"` (or `"REC"`, `"PR"`, etc.).
3. Generate static.html by ReSpec from <https://w3c.github.io/wot-scripting-api/> (click "ReSpec" top right and choose "Export" then export as "HTML"). Make sure that you disable browser extensions or open in private window.
4. Output Overview.html as a result of [HTML Tidy](https://www.html-tidy.org/). Use the following command (`tidy -ashtml -i static.html > Overview.html`). The `-ashtml` option is needed until [this issue](https://github.com/htacg/tidy-html5/issues/660) is resolved at HTML Tidy.
5. Fix duplicate IDs (see [fix-id.pl](fix-id.pl)) caused by ReSpec not supporting conformance classes
    * `cp Overview.html backup.html; ./fix-id.pl backup.html > Overview.html`

## How to Add your Edits based on the Pubrules Errors and Warnings

After checking Overview.html using the [Pubrules checker](https://www.w3.org/pubrules/), we have to edit index.html and then
regenerate the static HTML based on the procedure above to make it easier to generate a Pull Request to update the original
at <https://w3c.github.io/wot-scripting-api/> later.

1. Edit index.html,
2. Generate static.html by ReSpec from the index.html (click "ReSpec" top right and choose "Export" then export as "HTML",
3. copy static.html to Overview.html and tidy it up,
4. If there are any remaining errors/warnings with the Pubrules checker results, repeat the edit by going back to #1.
5. Generate diff.html via <http://services.w3.org/htmldiff>

Note: You cannot use a tool like <https://htmlpreview.github.io> since they do not have static html as a resource that the pubrule
checkers can use.

## Manual Link Corrections

Some redirects come from [specref](https://www.specref.org/) not being up to date. In those cases, you need to manually update the final Overview.html.
