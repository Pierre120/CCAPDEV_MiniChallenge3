$(document).ready(function () {

    /*
    TODO:   The code below attaches a `keyup` event to `#refno` text field.
            The code checks if the current reference number entered by the user
            in the text field does not exist in the database.

            If the current reference number exists in the database:
            - `#refno` text field background color turns to red
            - `#error` displays an error message `Reference number already in
            the database`
            - `#submit` is disabled

            else if the current reference number does not exist in the
            database:
            - `#refno` text field background color turns back to `#E3E3E3`
            - `#error` displays no error message
            - `#submit` is enabled
    */
    $('#refno').keyup(function () {
        // your code here
        // Get reference number
        let refno = $('#refno').val();

        $.get('/getCheckRefNo', { refno: refno }, function(result) {
            if(result.refno == refno) {
                $('#refno').css('background-color', 'red');
                $('#error').text('Reference number already in the database');
                $('#submit').prop('disabled', true);
            }
            else {
                $('#refno').css('background-color', '#E3E3E3');
                $('#error').text('');
                $('#submit').prop('disabled', false);
            }
        });
    });

    /*
    TODO:   The code below attaches a `click` event to `#submit` button.
            The code checks if all text fields are not empty. The code
            should communicate asynchronously with the server to save
            the information in the database.

            If at least one field is empty, the `#error` paragraph displays
            the error message `Fill up all fields.`

            If there are no errors, the new transaction should be displayed
            immediately, and without refreshing the page, after the values
            are saved in the database.

            The name, reference number, and amount fields are reset to empty
            values.
    */
    $('#submit').click(function () {
        // your code here
        // Retrieve form inputs
        let newName = $('#name').val();
        let newRefno = $('#refno').val();
        let newAmount = $('#amount').val();
        // Create transaction object
        let newTransaction = {
            name: newName,
            refno: newRefno,
            amount: newAmount
        }

        // Reset form and error message
        $('#name').val('');
        $('#refno').val('');
        $('#amount').val('');
        $('#error').text('');

        // Check for empty fields
        if(newName == '' || newRefno == '' || newAmount == '') {
            $('#error').text('Fill up all fields.');
            return;
        }

        // Asynchronously communicate with server with adding new transaction
        $.get('/add', newTransaction, function(card) {
            
            if(card != '') {
                $('#cards').append(card);
            }
        });
    });

    /*
    TODO:   The code below attaches a `click` event to `.remove` buttons
            inside the `<div>` `#cards`.
            The code deletes the specific transaction associated to the
            specific `.remove` button, then removes the its parent `<div>` of
            class `.card`.
    */
    $('#cards').on('click', '.remove', function () {
        // your code here
        // Get the element info of the transaction to be deleted
        let elem = $(this).siblings("div.info").children("p.text")[1];
        // Get the refno
        let refno = $(elem).text().trim();
        // Get the card to be removed
        let card = $(this).parent();

        // Delete the transaction in the database
        $.get('/delete', {refno: refno}, function(flag) {
            // Checks if delete is successful
            if(flag) {
                // Removes the transaction card
                $(card).remove();
            }
        })
    });

})
