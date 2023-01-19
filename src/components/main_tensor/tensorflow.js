import React from "react";
import { Component } from 'react';

import * as tf from '@tensorflow/tfjs'

import './tensorflow.css'

// service
// import tensor_service from './../tesnsor_service/index';

class TensorFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            predict_list: [],
        };
    }

    componentDidMount() {
        this.define_predict_data()
    }

    // main functions ------------------------------
    define_predict_data() {
        // default_input_number
        let default_input_number = 10

        let predict_list = [];
        for (let i = 0; i < default_input_number; i++) {
            predict_list[i] = { y: undefined, pr_y: i + 1, y_pl: undefined }
        }

        this.setState({
            predict_list: predict_list
        });
    }


    add_new_value = (event, index) => {
        let predict_list = this.state.predict_list

        let input_number = parseInt(event.target.value);

        predict_list[index] = { y: input_number, pr_y: index + 1, y_pl: undefined }

        this.setState({
            predict_list: predict_list
        });

        this.predictNextNumbers()
    }


    // tensorflow functions ------------------------
    predictNextNumbers = async () => {
        let predict_list = this.state.predict_list

        let x = [];
        let y = [];


        predict_list.forEach((item, index) => {
            if (item.y && item.y !== null && item.y !== undefined) {
                x.push(index + 1)
                y[index] = item.y
            } else if (item.pr_y && item.pr_y !== null && item.pr_y !== undefined) {
                x.push(index + 1)
                y[index] = item.pr_y
            }
        });

        // model
        // defining the model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        // define tensors
        const xs = tf.tensor1d(x)
        const ys = tf.tensor1d(y)


        // xs.print()
        // ys.print()

        // // fit model
        await model.fit(xs, ys, { epochs: 1000 })


        // predict
        let do_predict = true;

        for (let i = 0; i < predict_list.length; i++) {
            if (predict_list[i].y === null || predict_list[i].y === undefined) {
                do_predict = false
            }
        }

        if (do_predict) {
            // predict amount
            let predict_amount = 90;

            let new_predictions = []

            for (let i = 0; i < predict_amount; i++) {
                new_predictions[i] = i + predict_list.length + 1;
            }

            console.log(new_predictions)

            let predicted = model.predict(tf.tensor1d(new_predictions))
            const predicted_list = predicted.arraySync()

            console.log(predicted_list)

            for (let i = 0; i < predicted_list.length; i++) {
                // console.log(predicted_list[i][0])
                predict_list.push({ y: undefined, pr_y: undefined, y_pl: Math.round(predicted_list[i][0]) })
            }


            this.setState({
                predict_list: predict_list
            });

        }
    }


    // render
    render() {
        return (
            <div className="main-div container p-5">
                <div className="p-5">
                    <form>
                        <div>
                            <label for="exampleInputEmail1" className="form-label">Enter Numbers:</label>
                            <div className="row m-0">
                                {
                                    this.state.predict_list.map((item, index) => (
                                        <div className="col-1 px-1">
                                            <div className="input-index">x = {index + 1}</div>
                                            <input value={item.y}
                                                type="text"
                                                className="form-control text-center"
                                                placeholder={item.y_pl}
                                                onChange={(event) => { this.add_new_value(event, index) }}
                                            />

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default TensorFlow 
