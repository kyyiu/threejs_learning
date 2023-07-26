function loadSounds() {
const sounds = {
    driving : document.getElementById ('driving'),
    rev_short : document.getElementById ('rev_short'),
    rev_long : document.getElementById ('rev_long'),
    bounce : document.getElementById ('bounce'),
    crash : document.getElementById ('crash'),
};

return sounds;
}

export default function initSound(volume) {
const game_volume = volume || 0.5;
const sounds = loadSounds();
for (const sound in sounds)
{
    sounds[sound].volume = game_volume;
}
return sounds;
}
