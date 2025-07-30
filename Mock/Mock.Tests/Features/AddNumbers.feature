Feature: Add Numbers API

    Scenario: Add two positive numbers
        Given I have numbers 3 and 5
        When I POST them to /my/add-numbers
        Then the response sum should be 8

    Scenario: Add a positive and a negative number
        Given I have numbers 10 and -4
        When I POST them to /my/add-numbers
        Then the response sum should be 6

    Scenario: Add two zeros
        Given I have numbers 0 and 0
        When I POST them to /my/add-numbers
        Then the response sum should be 0
        
    Scenario: Add a positive and a negative number with larger absolute value
        Given I have numbers 100 and -20
        When I POST them to /my/add-numbers
        Then the response sum should be 80