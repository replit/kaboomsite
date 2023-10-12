import { Global, css } from "@emotion/react"
import Link from "next/link"
import * as React from "react"
import kaboomware from "kaboomware"
import Head from "comps/Head"
import View from "comps/View"
import Text from "comps/Text"
import Button from "comps/Button"
import Markdown from "comps/Markdown"

const bubble = css(`
&:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 10px solid transparent;
	border-right-color: #ffffff;
	border-left: 0;
	margin-top: 0px;
	margin-left: -10px;
}
`)

const example = `
\`\`\`js
const squeezeGame = {
    prompt: "Squeeze!",
    author: "tga",
    hue: 0.46,
    onLoad: (k) => {
        k.loadSound("fly", "sounds/fly.mp3")
        k.loadSprite("hand", "sprites/hand.png")
    },
    onStart: (k) => {
        const scene = k.make()
        const hand = scene.add([
            k.pos(420, 240),
            k.sprite("hand"),
        ])
        k.onButtonPress("action", () => {
            hand.squeeze()
            if (gotIt) {
                k.win()
            }
        })
        return scene
    },
}
\`\`\`
`.trim()

const Prop = ({
	title,
	desc,
}: {
	title: string,
	desc: string,
}) => (
	<View dir="row" align="center" gap={2}>
		<Text code size="big" bold><code>{title}</code></Text>
		<Text>{desc}</Text>
	</View>
)

export default function Doc() {
	const wareRef = React.useRef(null)
	const canvasRef = React.useRef<null | HTMLCanvasElement>(null)
	React.useEffect(() => {
		return
		if (!canvasRef.current) return
		const ware = kaboomware([{
			prompt: "Squeeze!",
			author: "yourname",
			hue: 0.46,
			onLoad: (k) => {
			},
			onStart: (k) => {
				const scene = k.make()
				return scene
			},
		}], {
			// @ts-ignore
			canvas: canvasRef.current,
			scale: 0.8,
			dev: true,
		})
	}, [])
	return (
		<View
			align="center"
			gap={4}
			padX={3}
			stretch
			css={{
				width: "100%",
				maxWidth: "800px",
				margin: "64px auto",
			}}>
			<Head title="KaboomWare" icon="/static/img/kaboomware/logo.png" />
			<Global
				styles={css`
					img {
						image-rendering: crisp-edges;
						image-rendering: pixelated;
					}
				`}
			/>
			<img
				src="/static/img/kaboomware/logo.png"
				css={{
					width: 480,
					maxWidth: "100%",
				}}
			/>
			<Text size="big" align="center">KaboomWare is a mini-game engine + event based on Kaboom, inspired by the great WarioWare series.</Text>
			<View
				dir="row"
				gap={4}
				align="center"
				width="100%"
			>
				<img src="/static/img/kaboomware/ken.png" css={{ width: 160 }} />
				<View gap={2} dir="column" stretchY justify="between" css={{ flex: 1 }}>
					<View bg="#ffffff" pad={2} rounded css={bubble}>
						<Text color="#000000">You must supply 200 minigames by the end of 2023, or we have to destroy your planet.</Text>
					</View>
					<Text color={3}>Ken (alien), KaboomWare operation lead</Text>
				</View>
			</View>
			<View dir="row" gap={2} align="center">
				<Text>There will be a monthly KaboomWare game jam, where you make as many KaboomWare mini-games as possible! (they have to be fun tho)</Text>
				<img src="/static/img/kaboomware/cal.png" />
			</View>
			<Button padX={1} padY={1} action={() => window.open("https://replit.com/@replit/KaboomWare?v=1")}>
				<img src="/static/img/replit.png" css={{ width: 32 }} />
				<Text>Code on Replit!</Text>
			</Button>
			<View align="center" gap={2}>
				<img src="/static/img/kaboomware/engine.png" />
				<View pad={2} bg={2} rounded outlined>
					<Text>KaboomWare is based on <Link href="/">Kaboom</Link>, if you&apos;re not familiar with Kaboom start with <Link href="/doc/intro">this tutorial</Link>!</Text>
				</View>
				<Text color={2}>A KaboomWare mini-game is just a JavaScript object, with 5 entries:</Text>
			</View>
			<View gap={2}>
				<Prop title="prompt" desc="The title of the game, telling player what they should do. (Usually just a simple verb!)" />
				<Prop title="author" desc="Your name" />
				<Prop title="hue" desc="Hue of the background of the game (0.0 - 1.0)." />
				<Prop title="onLoad" desc="Load assets of your mini-game" />
				<Prop title="onStart" desc="Main entry point of your mini-game gameplay. Should return a Kaboom game object that contains the entire scene and behavior." />
			</View>
			<Text color={2}>Here is an example mini-game!</Text>
			<Markdown src={example} />
			<Text>For more examples, see <a href="https://github.com/slmjkdbtl/kaboomware/tree/master/example/games">here</a></Text>
			<canvas ref={canvasRef} css={{ borderRadius: 8 }} />
		</View>
	)
}
