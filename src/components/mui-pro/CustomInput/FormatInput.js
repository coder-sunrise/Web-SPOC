import React from 'react'
import ReactDOM from 'react-dom'
import numeral from 'numeral'

import Cleave from 'cleave.js/react'

class FormatInput extends React.PureComponent {

    // constructor (props, context) {
    //     super(props, context)
    // }

    onChange= (event)=> {
        if(!this.props.field && this.props.onChange)
            this.props.onChange(event)

    }

    onFocus= (event)=> {
        // console.log(this.props)
        if(this.props.onFocus)this.props.onFocus(event)
        const el =event.target
        let endPos=el.value.length
        let startPos =0
        if(this.props.currency){
            endPos=el.value.length-3
            startPos=1
        }
        if(el.setSelectionRange){
            el.setSelectionRange(startPos,endPos)
        }
        // update some state
    }

    onBlur= (event)=> {
        // console.log(this.props)
        if(this.props.onBlur)this.props.onBlur(event)
        if(this.props.field && this.props.field.onChange)
                this.props.field.onChange({
                target: {
                    value: numeral(event.target.value).value(),
                    name:this.props.field.name,
                },
            }, this.props)
        // update some state
    }

    render () {
        const {currency, ...props}=this.props
        return (
          <Cleave 

            {...props}
            onFocus={this.onFocus}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
        )
    }
}

export default FormatInput