const MODULE_ID = "Background-Locker-FOUNDRYVTT";

Hooks.once('init', () => {
    // Enregistrement du réglage pour l'image globale
    game.settings.register(MODULE_ID, "bgPath", {
        name: "Image de fond par défaut",
        hint: "Le chemin vers l'image qui restera bloquée derrière l'interface.",
        scope: "world",
        config: true,
        type: new foundry.data.fields.FilePathField({categories: ["IMAGE"]}),
        default: "",
        onChange: () => { if (canvas.ready) canvas.draw(); }
    });
});

// Injection de la case à cocher dans la config de la scène
Hooks.on('renderSceneConfig', (app, html, data) => {
    const status = app.document.getFlag(MODULE_ID, "isLocked");
    const checkbox = `
        <hr>
        <div class="form-group">
            <label>Verrouiller le fond d'écran</label>
            <input type="checkbox" name="flags.${MODULE_ID}.isLocked" ${status ? 'checked' : ''}>
            <p class="notes">Si coché, l'image définie dans les réglages du module s'affichera de façon fixe derrière l'UI.</p>
        </div>`;
    
    html.find('.tab[data-tab="appearance"]').append(checkbox);
});

// Application de l'effet visuel
Hooks.on('canvasReady', () => {
    const isLocked = canvas.scene?.getFlag(MODULE_ID, "isLocked");
    const bgImage = game.settings.get(MODULE_ID, "bgPath");

    if (isLocked && bgImage) {
        document.body.style.backgroundImage = `url('${bgImage}')`;
        document.body.classList.add('lock-bg-active');
        // Force la transparence du fond de scène nat