//This is light setup! (configurable cache)
const Aoijs = require("aoi.js-light")
const express = require("express")
const app = express()

app.get("/", (req, res) => {
 res.send("samlelkom mamang!")
})

app.listen(3000, () => {
 console.log("Whatever you want to put here")
})

const bot = new Aoijs.Cache({
    token: process.env.TOKEN, //Discord Bot Token
    prefix: "j!", //Customizable
    cache: {
        Guilds: true,
        Channels: false,
        Overwrites: false,
        Roles: false,
        Emojis: false,
        Presences: false
    }
});

bot.onMessage() //Allows to run Commands

bot.variables({
giveawaychannelid: 0,
giveawayguildid: 0,
giveawayprize: "",
giveawaydescription: "",
giveawaytime: 0,
giveawayparticipants: "",
giveawayisfinished: "false",
giveawayisgiveaway: "false",
no: "❌",
time: "",
data:""
})

bot.command({
    name: "giveaway",
    code: `
$if[$message==]
$author[$userTag[$authorID];$authorAvatar]
$title[Giveaway options]
$description[
$addField[End;End a giveaway using a message ID or URL
> \`giveaway end <message ID/URL>\`;yes]
 
$addField[Reroll;Reroll giveaway using a message ID or URL
> \`giveaway reroll <message ID/URL>\`;yes]
 
$addField[Start;Start a giveaway
> \`giveaway start <prize>?-<description>?-<time>\`;yes]
]
$color[BLUE]
$elseIf[$toLowercase[$message[1]]==start]
$setTimeout[$get[replace];messageID: $get[id]
channelID: $channelID
guildID: $guildID
description: $splitText[2]
prize: $get[replace2]
time: $get[time]]
$setMessageVar[giveawayisgiveaway;true;$get[id]]
$setMessageVar[giveawaytime;$get[time];$get[id]]
$setMessageVar[giveawaydescription;$splitText[2];$get[id]]
$setMessageVar[giveawayprize;$get[replace2];$get[id]]
$setMessageVar[giveawaychannelid;$channelID;$get[id]]
$setMessageVar[giveawayguildid;$guildID;$get[id]]
$let[id;$sendMessage[{author:$userTag[$authorID]:$authorAvatar}
{title:A giveaway has been started!}
{field:Prize#COLON#:\`$get[replace2]\`:yes}
{field:Description#COLON#:$splitText[2]:yes}
{field:Time#COLON#:<t#COLON#$get[time]#COLON#R> <t#COLON#$get[time]#COLON#T>:yes}
{footer:React with 🔵 to participate}
{timestamp}
{color:BLUE}
{reactions:🔵};yes]]
$let[time;$truncate[$divide[$djsEval[$ms[$get[replace]] + $dateStamp;yes];1000]]]
$onlyIf[$djsEval[require('ms')("$get[replace]") ? true : false;yes]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$get[no] Invalid \`<time>\` argument given.
 
Usage:
$get[usage]}
{color:RED}]
$onlyIf[$splitText[2]!=;$get[err]]
$onlyIf[$get[replace2]!=;$get[err]]
$let[replace2;$advancedTextSplit[$messageSlice[1];?-;1]]
$let[replace;$djsEval["$replaceText[$splitText[3]; ;]" || '1 hour';yes]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
$get[usage]
$let[usage;\`giveaway start <prize>?-<description>?-<time>\`]}
{color:RED}]
$textSplit[$message;?-]
$endElseIf
$elseIf[$toLowercase[$message[1]]==reroll]
$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
$author[$userTag[$get[st]];$userAvatar[$get[st]]]
$title[A giveaway has been rerolled!;https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]]
$description[
$addField[Time:;<t:$getMessageVar[giveawaytime;$get[id]]:R> <t:$getMessageVar[giveawaytime;$get[id]]:T>;yes]
 
$addField[Description:;$getMessageVar[giveawaydescription;$get[id]];yes]
 
$addField[Prize:;\`$getMessageVar[giveawayprize;$get[id]]\`;yes]
]
$addTimestamp
$color[BLUE]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$getMessageVar[giveawayparticipants;$get[id]]; ]
$onlyIf[$getMessageVar[giveawayisfinished;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Please wait until giveaway [$get[id]](https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]) ends, or do \`$getServerVar[prefix]giveaway end $get[id]\` to end.}
{color:RED}]
$onlyIf[$getMessageVar[giveawayisgiveaway;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] \`$get[id]\` is not a valid giveaway}
{color:RED}]
$let[id;$replaceText[$replaceText[$checkCondition[$get[split]==];true;$message[2]];false;$get[split]]]
$onlyIf[$get[if]==true;$get[err]]
$onlyIf[$message[2]!=;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
\`$get[usage]\`}
{color:RED}]
$let[if;$replaceText[$replaceText[$checkCondition[$isNumber[$message[2]]==true];true;$checkCondition[$charCount[$message[2]]==18]];false;$replaceText[$replaceText[$checkCondition[$isNumber[$get[split]]==true];true;$checkCondition[$charCount[$get[split]]==18]];false;false]]]
$let[split;$advancedTextSplit[$message[2];//;2;/;5]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Invalid \`<message ID/URL>\` given.
 
Usage:
$get[usage]}
{color:RED}]
$let[usage;\`giveaway reroll <message ID/URL>\`]
$endElseIf
$elseIf[$toLowercase[$message[1]]==end]
$setMessageVar[giveawaytime;$get[time];$get[id]]
$setMessageVar[giveawayisfinished;true;$get[id]]
$setMessageVar[giveawayparticipants;$get[participants];$get[id]]
$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
$author[$userTag[$get[st]];$userAvatar[$get[st]]]
$title[A giveaway has been ended!;https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]]
$description[
$addField[Time:;<t:$get[time]:R> <t:$get[time]:T>;yes]
 
$addField[Description:;$getMessageVar[giveawaydescription;$get[id]];yes]
 
$addField[Prize:;\`$getMessageVar[giveawayprize;$get[id]]\`;yes]
]
$addTimestamp
$color[BLUE]
$let[time;$truncate[$divide[$datestamp;1000]]]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$get[participants]; ]
$let[participants;$replaceText[$replaceText[$getReactions[$getMessageVar[giveawaychannelid;$get[id]];$get[id];🔵;id];$clientID,;];,; ]]
$onlyIf[$getMessageVar[giveawayisfinished;$get[id]]==false;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Giveaway [$get[id]](https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]) has already been ended}
{color:RED}]
$onlyIf[$getMessageVar[giveawayisgiveaway;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] \`$get[id]\` is not a valid giveaway}
{color:RED}]
$let[id;$replaceText[$replaceText[$checkCondition[$get[split]==];true;$message[2]];false;$get[split]]]
$onlyIf[$get[if]==true;$get[err]]
$onlyIf[$message[2]!=;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
\`$get[usage]\`}
{color:RED}]
$let[if;$replaceText[$replaceText[$checkCondition[$isNumber[$message[2]]==true];true;$checkCondition[$charCount[$message[2]]==18]];false;$replaceText[$replaceText[$checkCondition[$isNumber[$get[split]]==true];true;$checkCondition[$charCount[$get[split]]==18]];false;false]]]
$let[split;$advancedTextSplit[$message[2];//;2;/;5]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Invalid \`<message ID/URL>\` given.
 
Usage:
$get[usage]}
{color:RED}]
$let[usage;\`giveaway end <message ID/URL>\`]
$endElseIf
$endIf
$onlyBotPerms[addreactions;{author:$userTag[$authorID]:$auhorAvatar}
{description:$getVar[no] I dont have the permission to use this command.
 
Missing:
\`add reactions\`}
{color:RED}]
$onlyPerms[managechannels;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] You dont have the permission to use this command.
 
Missing:
\`manage channels\`}
{color:RED}]
`
})
 
bot.timeoutCommand({
    code: `
$setMessageVar[giveawayisfinished;true;$get[id]]
$setMessageVar[giveawayparticipants;$get[participants];$get[id]]
$channelSendMessage[$timeoutData[channelID];$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
{author:$userTag[$get[st]]:$userAvatar[$get[st]]}
{title:A giveaway has ended!}
{url:https://discord.com/channels/$timeoutData[guildID]/$timeoutData[channelID]/$get[id]}
{field:Prize#COLON#:\`$timeoutData[prize]\`:yes}
{field:Description#COLON#:$timeoutData[description]:yes}
{field:Time#COLON#:<t#COLON#$timeoutData[time]#COLON#R> <t#COLON#$timeoutData[time]#COLON#T>:yes}
{timestamp}
{color:BLUE}]
$let[id;$timeoutData[messageID]]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$get[participants]; ]
$let[participants;$replaceText[$replaceText[$getReactions[$timeoutData[channelID];$timeoutData[messageID];🔵;id];$clientID,;];,; ]]
$onlyIf[$getMessageVar[giveawayisfinished;$timeoutData[messageID]]==false;]
`
})


bot.command({
name: "ping", //Trigger name (command name)
code: `$ping Pong!` //Code
})

bot.command({
  name:"slowmode",
  code:`$description[**Slowmode telah diganti menjadi $replaceText[$replaceText[$replaceText[$replaceText[$message;s; Detik;-1];m; Menit;-1];h; Jam;-1];0s; Reset;-1] Di channel <#$channelID>**]
  $footer[$username#$discriminator;$authorAvatar]
  $addTimestamp
  $slowmode[$channelID;$message]
  $color[RANDOM]
  $onlyPerms[manageroles;{title:emang nya lu staff <@$authorID>?}{color:RANDOM}]
  $onlyIf[$message!=;{title:hmm.. oh anda gatau format? format nya adalah #slowmode angka s/m/h 
  
s = detik
m = menit
h = jam}{color:RANDOM}]
`
})

bot.command({
  name:"resetslowmode",
  code:`$slowmode[$channelID;0s]
  $author[Slowmode telah di reset oleh $username#$discriminator;$authorAvatar]
  $color[RANDOM]
  $onlyPerms[manageroles;{title:emang nya lu staff <@$authorID>?}{color:RANDOM}]`
})

bot.command({
name: "warn",
code: `
$title[Warn]
$description[<@$mentioned[1]> Telah di warn!

Alasan : $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;Alasan tidak di berikan.];false;$messageSlice[1]]]
$footer[warned by $username;$authorAvatar]
$addTimestamp
$color[RANDOM]
$argsCheck[>1;PENGUNAAN BENAR : -warn {user} {alasan}]
$giveRoles[$mentioned[1];880478367114215435]
$onlyIf[$mentioned[1]!=;Mention orang!]
$onlyPerms[manageroles;cuman staff yg boleh pake command ini]
$setUserVar[warn;$sum[$getUserVar[warn;$mentioned[1]];1];$mentioned[1]]
$onlyIf[$mentioned[<]!=;$authorID;<@$authorID>Mau ngewarn diri sendiri lawak bro?]
$onlyIf[$rolePosition[$highestRole[$authorID]]<=$rolePosition[$highestRole[$get[member]]];ngapain coba ngewarn atasan <@$authorID>]`
})


bot.variables({
warn:"0",
})
bot.command({ 
 name: "checkwarn",
code: `
$title[__**WARN CHECK**__]
$description[**$username[$mentioned[1]]#$discriminator[$mentioned[1]] punya $getUserVar[warn;$mentioned[1]] Warn**]
$color[d7342a]
$onlyIf[$mentioned[1]!=;**Mention User!**]
$onlyPerms[manageroles;cuman staff.]`
})

bot.command({
  name:"removewarn",
  code:`$setUserVar[warn;0;$findUser[$message[1]]]
  $title[warn <@$mentioned[1]> telah di hapus oleh **$username**]
  $color[RANDOM]`
})

bot.command({
  name:"eval",
  code:`$eval[$message]
  $onlyIf[$botOwnerID==$authorID;Kau bukan tuan ku paman <@$authorID>]`
})

bot.command({
  name:"mute",
  code:`$giveRoles[$mentioned[1];881926653079584769]
  $title[<@$mentioned[1]> telah di mute]
  $color[RANDOM]
  $onlyPerms[manageroles;cuman staff.]`
})

bot.command({ 
name:"welcome",
code:`<@$authorID> **Selamat datang di $serverName Anda member ke $membersCount di $serverName**
$title[Selamat datang!] 
$description[<:Zero_GiveLove:886537011433988096>Silahkan baca peraturan di <#869538196340498463>

<:zero_sunglasses:886539799744356432> Silahkan ambil role di <#887946796788228106>

Dan silahkan menikmati Server EMPEDISC!<:hehenotbad:882975978010333214>
] 
$suppressErrors
$footer[$username terima kasih dah gabung!]
$addTimestamp
$thumbnail[$authorAvatar]
$color[BLUE]
`
})

bot.command({
  name:"nuke",
  code:`
$deleteChannels[$channelID]
$cloneChannel
$onlyPerms[admin;Cuma admin]
 `
})
bot.command({
name:"embed",
code:`
$title[$splitText[1]]
$description[$splitText[2]]
$color[$splitText[3]]
$footer[$splitText[4]]
$author[$splitText[5]]
$thumbnail[$authorAvatar]
$argsCheck[>1;Correct usage **embed title / description / hex color / footer / author**]
$onlyPerms[manageserver;Cuman staff.]
$textSplit[$message;/]`
})

bot.command({
 name:"clear",
 code:`$clear[$message]
 $argsCheck[>1;-clear ANGKA]`
})

bot.command({
  name:"clear",
  code:`$wait[7]
  $onlyIf[$message==]
$title[$messagemessage telah di clear]
$color[RANDOM]
$addTimestamp`
})

bot.command({
name: "$alwaysExecute",
code:
`
$useChannel[887958986584883220]
$title[Report terbaru]
$description[$message]
$footer[$username#$discriminator;]
$color[RANDOM]
$deletecommand
$onlyForChannels[887959746303365170;]
`
})

bot.command({
  name:"$alwaysExecute",
  code:`$deleteIn[5s]
  <@$authorID> Terima kasih telah me report dan report ini akan di tindak lanjuti oleh moderator :)
  $onlyForChannels[887959746303365170;]`
})

bot.command({
  name:"<@878298159510585425>",
  nonPrefixed: true,
  code:`$title[Halo saya adalah bot moderator kedua di EMPEDISC prefix gua **#** pakai #help untuk melihat semua command.]
  $color[RANDOM]`
})

bot.command({
name: "help",
code:`
$if[$hasPerms[$authorID;manageserver]==true]
$editIn[3s;{description:**Akses diberikan kepada Staff : $username#$discriminator.**}{author:Akses di berikan:$authorAvatar}{color:GREEN};{title:Bantuan}{field:Moderation command:\`warn, clearwarn, removewarn, mute, nuke, embed, slowmode, clear\`}{color:BLUE}]
$else
$editIn[3s;{description:Akses tidak di berikan kepada user : $username. 

alasan : Bukan staff!}{color:RED}]
$endif
$title[Sedang mengautentikasi akses dari $username....]
$color[BLUE]
`
}) 



bot.command({
  name:"djseval",
  code:`$djsEval[$message]`,
})

bot.command({
  name:"!rank",
  nonPrefixed : true,
  code:`
$reply[$messageID;{title:Bro bro pake bot tolong di channel nya astaga}{color:RANDOM};yes]
$onlyForChannels[887935518543867944;]`
})

bot.command({
  name:"sarkas",
  code:`$jsonRequest[https://api.popcat.xyz/mock?text=$replaceText[$message; ;+;-1]]`
})

bot.command({
  name:"restartbot",
  code:`
$djsEval[setTimeout(() => {process.exit()}, 1000)]
  
$description[Restarting Bots....]
$color[RANDOM]  
  
  
$onlyForIDs[$botOwnerID;hanya owner!]`
})

bot.interactionCommand({
 name: "help", 
 code: `$interactionReply[;{title:Semua command}{field:Moderation command:\`warn, checkwarn, removewarn, mute, nuke, embed, slowmode\`, clear:yes}{footer:Requested by $username#$discriminator}{color:RANDOM}`
 })
 bot.onInteractionCreate()



bot.command({
name: "slash",
code: `
$createSlashCommand[$guildID;pingchat;ping ketika chat mati]`
//This will make our slash command
})

bot.interactionCommand({
  name: "pingchat",
  code: `$interactionReply[<@&869538196084637752> Kok sepi
  $onlyForChannels[887935518543867944;ngeping hanya bisa dilakukan di channel <#887935518543867944>]
  $serverCooldown[6h;Tunggu %time% untuk ngeping lagi! <@$authorID>]]`
})

bot.joinCommand({
  channel:"887937399827619890",
  code:`$image[https://api.popcat.xyz/welcomecard?background=https://media.discordapp.net/attachments/888507327458725908/894405107762991114/EMPEDISC.png&text1=$replaceText[$username; ;+;-1]&text2=Selamat+datang+di+empedisc!&text3=Member+ke+$membersCount&avatar=$replaceText[$authorAvatar;webp;png;-1]]
$color[BLUE]
$footer[$username#$discriminator adalah user ke $membersCount!]
$wait[2s]`
})
bot.onJoined()

bot.command({
name:"buttoncollector",
code:`
   $buttonCollector[$get[id];$authorID;1m;click;awaitclick;Only $userName can use this interaction,,64]
   $let[id;$apiMessage[$channelID;hi;;{actionRow:click me,2,1,click};;yes]]
     `
 })
bot.awaitedCommand({
name:"awaitclick",
code:`
   $interactionReply[Hello;;;64]
     `
 })


bot.command({
  name:"$alwaysExecute",
  code:`$reply[$messageID;Pernah di ajarin cara salam yang sopan ga ama ortu lu?]
$onlyIf[$toLowercase[$message]==p;]`
})

bot.command({
  name:"$alwaysExecute",
  code:`$reply[$messageID;hm hm hm emang lu limbad?]
$onlyIf[$toLowercase[$message]==hmm;]`
})

bot.command({
  name:"$alwaysExecute",
  code:`$reply[$messageID;bagi dong ngab]
$onlyIf[$toLowercase[$message]==wcash;]`  
})

bot.command({
  name:"welcomepreview",
  code:`$image[https://api.popcat.xyz/welcomecard?background=https://media.discordapp.net/attachments/888507327458725908/894405107762991114/EMPEDISC.png&text1=$replaceText[$username; ;+;-1]&text2=Selamat+datang+di+empedisc!&text3=Member+ke+$membersCount&avatar=$replaceText[$authorAvatar;webp;png;-1]]
$color[BLUE]
$footer[$username#$discriminator adalah user ke $membersCount!]`
})

bot.command({
  name:"empefamily",
  code:`$thumbnail[$userAvatar[$findUser[$message]]
  $footer[ANDA TELAH MENJADI BAGIAN DARI EMPEFAMILY;$serverIcon]
  $description[ANDA TELAH MENJADI BAGIAN DARI EMPEFAMILY DAN ANDA MERAIH +10000000 EMPECREDIT 👍]
  $color[BLUE]
  $giveRoles[$mentioned[1];900455078325026886]
  $onlyPerms[admin;apa lo]`
})

bot.command({
  name:"test",
  code:`Checking Perms once again..
  $editMessage[$message[1];{title:Acess Granted!}]
  `
})

bot.command({
    name: "timer",
    code: `$loop[1;count]
$setUserVar[data;$get[messageID],$channelID]
$djsEval[
const parse = require('parse-duration')
let secs = parse(d.args[0], 's')
d.client.db.set("main", 'time_' + d.message.guild.id + '_' + d.message.author.id, secs)
]
$let[messageID;$channelSendMessage[$channelID;$message[1];yes]]
$argsCheck[1;***ADD AN  ARG!!!***]`
})

bot.awaitedCommand({
    name: "count",
    code: `$if[$getUserVar[time]!=0]
$loop[1;count]
$editMessage[$advancedTextSplit[$getUserVar[data];,1];$getUserVar[time];$advancedTextSplit[$getUserVar[data];,;2]]
$setUserVar[time;$sub[$getUserVar[time];1]]
$else
$editMessage[$advancedTextSplit[$getUserVar[data];,1];<@$authorID> Timer Ended;$advancedTextSplit[$getUserVar[data];,;2]] $suppressErrors[Please only say a number]
$endif
$wait[1s]
`
})

bot.interactionCommand({
 name: "8ball", 
 code: `$interactionReply[Pertanyaan : $message 

jawaban : $randomText[y;ga;ya ndak tau;mungkin;bisa jadi]]`
 })
 bot.onInteractionCreate()