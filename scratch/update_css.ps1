$css = Get-Content "style.css" -Raw

# 1. Update :root variables
$css = $css -replace '--emerald: #1A5C45;', '--emerald: #C9A84C;'
$css = $css -replace '--emerald-mid: #2A7A5C;', '--emerald-mid: #DFBA55;' # lighter gold
$css = $css -replace '--emerald-light: #E6F5EE;', '--emerald-light: #FDF6E3;' # pale background

# 2. Update rgba values (26, 92, 69 is #1A5C45)
# Replace with rgba(201, 168, 76, ...) (C9A84C RGB)
$css = $css -replace 'rgba\(26, 92, 69,', 'rgba(201, 168, 76,'

# 3. Update my previous hover states to use --emerald-mid instead of --gold
# nav-cta:hover
$css = $css -replace 'background: var\(--gold\) !important;(\s+)color: var\(--ink\) !important;(\s+)transform: translateY\(-1px\);', 'background: var(--emerald-mid) !important;$1color: var(--ink) !important;$2transform: translateY(-1px);'

# .btn-primary:hover
$css = $css -replace 'background: var\(--gold\);(\s+)color: var\(--ink\);', 'background: var(--emerald-mid);$1color: var(--ink);'

# btn-price.outline:hover
$css = $css -replace 'background: var\(--gold\);(\s+)color: var\(--ink\);(\s+)border-color: var\(--gold\);', 'background: var(--emerald-mid);$1color: var(--ink);$2border-color: var(--emerald-mid);'

# btn-price.filled:hover
# wait, .btn-price.filled:hover was changed to gold
$css = $css -replace '\.btn-price\.filled:hover \{\s+background: var\(--gold\);\s+color: var\(--ink\);\s+\}', '.btn-price.filled:hover { background: var(--emerald-mid); color: var(--ink); }'

# .btn-ghost:hover
$css = $css -replace '\.btn-ghost:hover \{\s+background: var\(--gold\);\s+color: var\(--ink\);\s+border-color: var\(--gold\);\s+\}', '.btn-ghost:hover { background: var(--emerald-mid); color: var(--ink); border-color: var(--emerald-mid); }'

# .floating-wa:hover
$css = $css -replace '\.floating-wa:hover \{\s+transform: scale\(1.1\);\s+background-color: var\(--gold\);\s+\}', '.floating-wa:hover { animation: wa-wiggle 1s ease-in-out infinite; background-color: var(--emerald-mid) !important; }'

# Set WA normal color to gold since they said ALL green
$css = $css -replace 'background-color: #25D366;', 'background-color: #C9A84C;'

Set-Content "style.css" -Value $css
