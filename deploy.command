#!/bin/bash
# Quotami — Deploy in un click
# Doppio-click su questo file (Finder) per:
#   1. aggiungere tutte le modifiche
#   2. fare il commit con messaggio automatico
#   3. fare push su GitHub
#   4. Vercel ridistribuirà automaticamente entro ~30s

cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "  QUOTAMI — Deploy in corso"
echo "=========================================="
echo

# Rimuove eventuali lock file rimasti
rm -f .git/index.lock .git/HEAD.lock 2>/dev/null

# Stato attuale
echo "[1/4] File modificati:"
git status --short
echo

# Conta le modifiche
count=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$count" = "0" ]; then
  unpushed=$(git log --oneline origin/main..HEAD 2>/dev/null | wc -l | tr -d ' ')
  if [ "$unpushed" = "0" ]; then
    echo "[OK] Niente da deployare — il sito è già aggiornato."
    echo
    echo "Premi un tasto per chiudere…"
    read -n 1
    exit 0
  fi
  echo "[INFO] Niente da committare, ma ho $unpushed commit da pushare."
  echo
  echo "[2/4] Skip commit (niente di nuovo)."
else
  echo "[2/4] Faccio commit di $count file modificati…"
  git add -A || { echo "ERRORE in git add"; read -n 1; exit 1; }
  timestamp=$(date "+%Y-%m-%d %H:%M")
  git commit -m "deploy automatico — $timestamp" || { echo "ERRORE in git commit"; read -n 1; exit 1; }
fi
echo

echo "[3/4] Push su GitHub…"
git push 2>&1 || { echo "ERRORE nel push — controlla la tua connessione internet"; read -n 1; exit 1; }
echo

echo "[4/4] Push completato! Vercel sta ridistribuendo…"
echo
echo "Tra ~30 secondi:"
echo "  - apri https://quotami-it.vercel.app"
echo "  - premi Cmd+Shift+R per ricaricare senza cache"
echo
echo "=========================================="
echo "  ✓ FATTO"
echo "=========================================="
echo
echo "Premi un tasto per chiudere…"
read -n 1
