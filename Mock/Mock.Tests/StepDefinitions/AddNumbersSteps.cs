namespace Mock.Tests.StepDefinitions;

using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;
using TechTalk.SpecFlow;
using Microsoft.AspNetCore.Mvc.Testing;

[Binding]
public class AddNumbersSteps
{
    private readonly WebApplicationFactory<Program> _factory;
    private int _number1, _number2, _sum;
    private HttpResponseMessage _response;

    public AddNumbersSteps(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Given(@"I have numbers (.*) and (.*)")]
    public void GivenIHaveNumbers(int number1, int number2)
    {
        _number1 = number1;
        _number2 = number2;
    }

    [When(@"I POST them to /my/add-numbers")]
    public async Task WhenIPOSTThemToAddNumbers()
    {
        var client = _factory.CreateClient();
        var dto = new { Number1 = _number1, Number2 = _number2 };
        var content = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");
        _response = await client.PostAsync("/my/add-numbers", content);
    }

    [Then(@"the response sum should be (.*)")]
    public async Task ThenTheResponseSumShouldBe(int expectedSum)
    {
        /*var responseString = await _response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(responseString);
        ((int)result.Sum).Should().Be(expectedSum);*/
        
        var responseString = await _response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<SumResponse>(responseString);
        result.Sum.Should().Be(expectedSum);
    }
}