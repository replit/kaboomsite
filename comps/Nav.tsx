import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { keyframes } from "@emotion/react"
import { Info } from "react-feather"
import fs from "fs/promises"
import useMediaQuery from "hooks/useMediaQuery"
import useClickOutside from "hooks/useClickOutside"
import useUpdateEffect from "hooks/useUpdateEffect"
import Background from "comps/Background"
import View from "comps/View"
import Text from "comps/Text"
import Markdown from "comps/Markdown"
import matter from "gray-matter"
import Input from "comps/Input"
import Drawer from "comps/Drawer"
import ThemeSwitch from "comps/ThemeSwitch"
import doc from "doc.json"
import { GetServerSideProps } from "next"

const popping = keyframes(`
	0% {
		transform: scale(1);
	}
	5% {
		transform: scale(1.1);
	}
	10% {
		transform: scale(1);
	}
`)

const Logo: React.FC = () => (
	<Link href="/">
		<View
			desc="Back to home"
			rounded
			css={{
				"cursor": "pointer",
			}}
		>
			<img
				src="/static/img/kaboomjs.png"
				alt="kaboomjs"
				css={{
					width: "100%",
				}}
			/>
		</View>
	</Link>
)

interface NavLinkProps {
	text: string,
	link: string,
}

const NavLink: React.FC<NavLinkProps> = ({
	text,
	link,
}) => (
	<Link href={link}>
		<View
			focusable
			padX={1}
			padY={0.5}
			rounded
			css={{
				cursor: "pointer",
				position: "relative",
				left: "-4px",
				":hover": {
					background: "var(--color-highlight)",
					"> *": {
						color: "var(--color-fghl) !important",
					},
				},
			}}
		>
			<Text color={2}>{text}</Text>
		</View>
	</Link>
)

const NARROW = 840
const MOBILE = 640

const Index: React.FC<{
	content?: "reference" | "tutorial",
	contentItems?: any[],
}> = ({ content, contentItems }) => {

	const isNarrow = useMediaQuery(`(max-width: ${NARROW}px)`)
	const [expanded, setExpanded] = React.useState(false)

	useUpdateEffect(() => {
		setExpanded(!isNarrow)
	}, [isNarrow])

	return isNarrow ? (
		<Drawer
			handle
			height="90%"
			expanded={expanded}
			setExpanded={setExpanded}
		>
			<IndexContent shrink={() => setExpanded(false)} content={content} contentItems={contentItems} />
		</Drawer>
	) : (
		<View
			stretchY
			bg={2}
		>
			<IndexContent shrink={() => setExpanded(false)} content={content} contentItems={contentItems} />
		</View>
	)

}

const IndexContentSection: React.FC<React.PropsWithChildren<{
	sectionName: string;
}>> = ({
	children,
	sectionName
}) => (
		<View stretchX gap={1} key={sectionName}>
			<Text size="big" color={3}>{sectionName}</Text>
			<View>
				{children}
			</View>
		</View>
	)

const IndexContentItem: React.FC<{
	title: string;
	link: string;
	shrink: () => void;
}> = ({ title, shrink, link }) => (
	<a href={`/${link}`}>
		<View
			padY={0.5}
			onClick={shrink}
			css={{
				cursor: "pointer",
				borderRadius: 8,
				":hover": {
					background: "var(--color-bg3)",
				},
			}}
		>
			<Text color={2} code>{title}</Text>
		</View>
	</a>
);


type SectionTuple = [string, string[]]

interface IndexContentProps {
	shrink: () => void,
	content?: "reference" | "tutorial",
	contentItems?: any[],
}

const IndexContent: React.FC<IndexContentProps> = ({
	shrink,
	content = "reference",
	contentItems,
}) => {

	const [query, setQuery] = React.useState("")

	const filteredSections = doc.sections.reduce((acc: SectionTuple[], cur) => {
		const filteredEntries = cur.entries
			.filter(name => query ? name.match(new RegExp(query, "i")) : true)

		// Exclude sections that have no matching entries.
		return filteredEntries.length > 0
			? acc.concat([[cur.name, filteredEntries]])
			: acc
	}, [])

	return <>

		<View
			dir="column"
			gap={2}
			stretchY
			width={240}
			pad={3}
			css={{
				overflowX: "hidden",
				overflowY: "auto",
			}}
		>
			<View css={{ cursor: "pointer" }}>
				<Info size={20} color="var(--color-fg3)" onClick={() => {
					alert("The kaboom.js mark is not affiliated with Activision Publishing, Inc. or the KABOOM! trademark owned by Activision")
				}} />
			</View>
			<Logo />
			<ThemeSwitch width={160} />
			<View gap={0.5}>
				<NavLink link="/play" text="Playground" />
				<NavLink link="/doc/setup" text="Tutorials" />
				<NavLink link="/blog" text="Blog" />
				<NavLink link="https://github.com/replit/kaboom" text="GitHub" />
				<NavLink link="https://discord.com/invite/aQ6RuQm3TF" text="Discord" />
				{/* <NavLink link="/kaboomware" text="KaboomWare" /> */}
			</View>

			<Input value={query} onChange={setQuery} placeholder="Search in doc" />

			{content == "reference" && (
				filteredSections.map(([sectionName, entries]) => {
					return (
						<IndexContentSection sectionName={sectionName} key={sectionName}>
							{entries.map((name) => {
								const mem = (doc as any).types["KaboomCtx"][0].members[name]?.[0] || (doc as any).types[name]?.[0]

								if (mem.jsDoc?.tags["deprecated"]) {
									return
								}

								const isFunc = mem.kind === "MethodSignature" || mem.kind === "FunctionDeclaration"

								return (
									<IndexContentItem
										key={name}
										title={`${name}${isFunc ? "()" : ""}`}
										link={`#${name}`}
										shrink={shrink}
									/>
								)
							})}
						</IndexContentSection>
					)
				})
			)}

			{content == "tutorial" && (
				<IndexContentSection sectionName={"Tutorials"}>
					{contentItems?.filter(tutorial => query ? tutorial.title.match(new RegExp(query, "i")) : true).map((tutorial) => (
						<IndexContentItem
							key={tutorial.title}
							title={tutorial.title}
							link={tutorial.link}
							shrink={shrink}
						/>
					))}
				</IndexContentSection>
			)}

		</View>
	</>

}

const Nav = ({
	children,
	content = "reference",
	contentItems,
}: React.PropsWithChildren<{
	content?: "reference" | "tutorial",
	contentItems?: any[],
}>) => (
	<Background pad={3} css={{
		[`@media (max-width: ${MOBILE}px)`]: {
			padding: "0 !important",
			borderRadius: 0,
		},
		[`@media (max-width: ${NARROW}px)`]: {
			paddingLeft: 40,
		},
	}}>
		<View
			stretch
			dir="row"
			align="center"
			bg={1}
			rounded
			outlined
			css={{
				overflow: "hidden",
				[`@media (max-width: ${MOBILE}px)`]: {
					borderRadius: 0,
				},
			}}
		>
			<Index content={content} contentItems={contentItems} />
			<View
				dir="column"
				gap={3}
				stretchY
				css={{
					overflowX: "hidden",
					overflowY: "auto",
					padding: 32,
					flex: "1",
					[`@media (max-width: ${MOBILE}px)`]: {
						padding: 24,
						paddingLeft: 40,
					},
				}}
			>
				{children}
			</View>
		</View>
	</Background>
)

export default Nav
