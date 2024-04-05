import Nav from "comps/Nav"
import { GetServerSideProps } from "next"
import doc from "doc.json"
import View from "comps/View"
import Doc from "comps/Doc"
import React from "react"
import { NARROW } from "pages"
import useMediaQuery from "hooks/useMediaQuery"
import Drawer from "comps/Drawer"
import Head from "comps/Head"

export interface ReferenceProps {
	refName: string
}

const Reference: React.FC<ReferenceProps> = ({
	refName,
}) => {
	const [showType, setShowType] = React.useState<string | null>(null)
	const isNarrow = useMediaQuery(`(max-width: ${NARROW}px)`)
	const types: { [key: string]: any } = doc.types

	const docEntries = Object.keys(types).filter(
		(name) => name.toLowerCase() === refName.toLowerCase(),
	)

	const docDefaultEntry = types[docEntries[0]][0]
	
	return (
		<Nav>
			<Head
				title={`Kaboom.js - ${docEntries[0]}`}
				desc={docDefaultEntry?.jsDoc?.doc ?? "No description"}
			/>
			{Object.keys(doc.types).filter(
				(name) => name.toLowerCase() === refName.toLowerCase(),
			).map((name) => (
				<View stretchX gap={3} pad={0} key={name}>
					<Doc
						id={name}
						key={name}
						name={name}
						anchor={name}
						typeref={setShowType}
					/>				
				</View>
			))}          
			<Drawer
				dir="right"
				pad={2}
				height="64%"
				paneWidth={isNarrow ? 320 : 360}
				expanded={showType !== null}
				setExpanded={(b) => {
					if (b === false) {
						setShowType(null)
					}
				}}
			>
				{showType &&
				<Doc
					anchor={showType}
					onAnchor={() => setShowType(null)}
					name={showType}
					typeref={setShowType}/>
				}
			</Drawer>
		</Nav>
	)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { name } = ctx.query

	return {
		props: {
			refName: name,
		},
	}

}

export default Reference