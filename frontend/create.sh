TYPE=$1
SUBTYPE=$2
NAME=$3

function create() {
    WHERE=$1
    NAME=$2

    touch $WHERE/$NAME.tsx
    echo "import React from 'react'" >> $WHERE/$NAME.tsx
    echo "import Styles from './$NAME.module.css'" >> $WHERE/$NAME.tsx
    echo "" >> $WHERE/$NAME.tsx
    echo "export function $NAME() {" >> $WHERE/$NAME.tsx
    echo "  return <></>" >> $WHERE/$NAME.tsx
    echo "}" >> $WHERE/$NAME.tsx

    touch $WHERE/$NAME.module.css

    # touch $WHERE/$NAME.test.tsx  # maybe when we learn how to make tests

    touch $WHERE/index.ts
    echo "import { $NAME } from './$NAME'" >> $WHERE/index.ts
    echo "export default $NAME" >> $WHERE/index.ts

}

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
    echo "Usage: $0 <type> <subtype> <name>"
    echo "Types: component, page"
    echo "Subtypes: any, if none use ."
    echo "Name: any"
    
    exit 1
fi

if [ "$TYPE" == "component" ]; then
    mkdir src/components/$SUBTYPE/$NAME -p
    create src/components/$SUBTYPE/$NAME $NAME
elif [ "$TYPE" == "page" ]; then
    mkdir src/pages/$SUBTYPE/$NAME -p
    create src/pages/$SUBTYPE/$NAME $NAME
else 
    echo "Invalid type"
fi
